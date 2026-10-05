-- Full database schema for the blog, for a NEW (empty) Supabase project.
-- Run it once in the Supabase SQL Editor. It can be run again safely.
--
-- Security: only the emails listed in admin_emails can manage the blog. Being logged in is
-- not enough (anyone can create an account with the public anon key if sign-ups are open).
-- >>> Replace the email in section 1 with your admin email before running. <<<

BEGIN;

-- 1. ADMINS
CREATE TABLE IF NOT EXISTS admin_emails (
  email TEXT PRIMARY KEY
);
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;  -- no policy: invisible through the API

INSERT INTO admin_emails (email) VALUES ('REMPLACE-PAR-TON-EMAIL@example.com')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt() ->> 'email');
$$;

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  color      TEXT NOT NULL DEFAULT '#C19A6B',
  bg         TEXT NOT NULL DEFAULT 'rgba(193,154,107,0.08)',
  border     TEXT NOT NULL DEFAULT 'rgba(193,154,107,0.25)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug, color, bg, border) VALUES
  ('IA',              'ia',              '#00E5FF', 'rgba(0,229,255,0.06)',   'rgba(0,229,255,0.2)'),
  ('Crypto',          'crypto',          '#a78bfa', 'rgba(167,139,250,0.06)', 'rgba(167,139,250,0.25)'),
  ('Algo Trading',    'algo-trading',    '#C19A6B', 'rgba(193,154,107,0.08)', 'rgba(193,154,107,0.25)'),
  ('Venture Capital', 'venture-capital', '#60a5fa', 'rgba(96,165,250,0.06)',  'rgba(96,165,250,0.25)'),
  ('Macro',           'macro',           '#9ca3af', 'rgba(156,163,175,0.06)', 'rgba(156,163,175,0.2)'),
  ('DeFi',            'defi',            '#a78bfa', 'rgba(167,139,250,0.06)', 'rgba(167,139,250,0.25)')
ON CONFLICT DO NOTHING;

-- 3. POSTS (this table was never in the repo: rebuilt from lib/types.ts and ArticleForm.tsx)
CREATE TABLE IF NOT EXISTS posts (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT NOT NULL DEFAULT '',
  excerpt          TEXT,
  cover_image      TEXT,
  tags             TEXT[] DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_title       TEXT,
  meta_description TEXT,
  views_count      INTEGER DEFAULT 0,
  likes_count      INTEGER DEFAULT 0,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  published_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC NULLS LAST);

-- 4. COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  parent_id    UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content      TEXT NOT NULL,
  likes_count  INTEGER DEFAULT 0,
  is_approved  BOOLEAN DEFAULT FALSE,
  is_reported  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments (is_approved);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments (parent_id);

-- 5. NEWSLETTER AND CONTACT
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts (is_read);

-- 6. COUNTERS (called by visitors through the API, so they run with the owner's rights)
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE posts SET views_count = COALESCE(views_count, 0) + 1 WHERE id = post_id;
$$;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = post_id;
$$;

CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE comments SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = comment_id;
$$;

-- 7. ROW LEVEL SECURITY: visitors read published content and can write comments,
--    subscriptions and messages; only admins manage everything.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage categories" ON categories;
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Admins manage posts" ON posts;
CREATE POLICY "Admins manage posts" ON posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT TO anon, authenticated
  WITH CHECK (is_approved = false);  -- a visitor can't publish their own comment directly
DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
CREATE POLICY "Public can read approved comments" ON comments FOR SELECT USING (is_approved = true);
DROP POLICY IF EXISTS "Admins manage comments" ON comments;
CREATE POLICY "Admins manage comments" ON comments FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins manage subscribers" ON newsletter_subscribers FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Anyone can send contact messages" ON contacts;
CREATE POLICY "Anyone can send contact messages" ON contacts FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage contacts" ON contacts;
CREATE POLICY "Admins manage contacts" ON contacts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- 8. IMAGE STORAGE (bucket "articles", used by the article editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'articles');
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'articles' AND is_admin());
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'articles' AND is_admin());
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'articles' AND is_admin());

COMMIT;
