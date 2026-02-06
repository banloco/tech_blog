-- Full corrected migration (idempotent-safe)
BEGIN;

-- 1. POSTS TABLE (upgrade existing)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 1.2 STORAGE BUCKET FOR IMAGES (insert if missing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: safer drop-and-create (storage.objects may already have policies)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'articles' );

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'articles' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
CREATE POLICY "Admin Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'articles' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'articles' AND auth.role() = 'authenticated' );

-- 1.3 FUNCTIONS
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Set existing posts to published where status is NULL
UPDATE posts SET status = 'published' WHERE status IS NULL;

-- Generate slugs for existing posts that don't have one
UPDATE posts SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 2. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  is_reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts(status, created_at DESC);

CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- 4. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read);

-- 5. ROW LEVEL SECURITY (RLS)

-- Posts RLS: create-only-if-missing
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Public can read published posts'
      AND schemaname = current_schema()
      AND tablename = 'posts'
  ) THEN
    CREATE POLICY "Public can read published posts" ON posts
      FOR SELECT USING (status = 'published');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Authenticated users can manage posts'
      AND schemaname = current_schema()
      AND tablename = 'posts'
  ) THEN
    CREATE POLICY "Authenticated users can manage posts" ON posts
      FOR ALL USING ((auth.role() = 'authenticated'));
  END IF;
END
$$;

-- Comments RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Keep explicit drop/create for the "Anyone can insert comments" policy to ensure it matches expected definition
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT 
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Public can read approved comments'
      AND schemaname = current_schema()
      AND tablename = 'comments'
  ) THEN
    CREATE POLICY "Public can read approved comments" ON comments
      FOR SELECT USING (is_approved = TRUE);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Authenticated users can manage comments'
      AND schemaname = current_schema()
      AND tablename = 'comments'
  ) THEN
    CREATE POLICY "Authenticated users can manage comments" ON comments
      FOR ALL USING ((auth.role() = 'authenticated'));
  END IF;
END
$$;

-- Newsletter RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Anyone can subscribe'
      AND schemaname = current_schema()
      AND tablename = 'newsletter_subscribers'
  ) THEN
    CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
      FOR INSERT WITH CHECK (TRUE);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Authenticated users can manage subscribers'
      AND schemaname = current_schema()
      AND tablename = 'newsletter_subscribers'
  ) THEN
    CREATE POLICY "Authenticated users can manage subscribers" ON newsletter_subscribers
      FOR ALL USING ((auth.role() = 'authenticated'));
  END IF;
END
$$;

-- Contacts RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Anyone can send contact messages'
      AND schemaname = current_schema()
      AND tablename = 'contacts'
  ) THEN
    CREATE POLICY "Anyone can send contact messages" ON contacts
      FOR INSERT WITH CHECK (TRUE);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies
    WHERE policyname = 'Authenticated users can manage contacts'
      AND schemaname = current_schema()
      AND tablename = 'contacts'
  ) THEN
    CREATE POLICY "Authenticated users can manage contacts" ON contacts
      FOR ALL USING ((auth.role() = 'authenticated'));
  END IF;
END
$$;

COMMIT;