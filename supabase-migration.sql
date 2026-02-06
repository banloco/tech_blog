-- ============================================
-- SUPABASE SQL MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. POSTS TABLE (upgrade existing)
-- Add new columns if they don't already exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Set existing posts to published
UPDATE posts SET status = 'published' WHERE status IS NULL;

-- Generate slugs for existing posts that don't have one
UPDATE posts SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 2. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);

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

-- Posts: public read for published, admin write
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Authenticated users can manage posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Comments: public can insert, read approved; admin manage all
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "Public can read approved comments" ON comments
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY IF NOT EXISTS "Authenticated users can manage comments" ON comments
  FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter: public can insert; admin can read/delete
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "Authenticated users can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- Contacts: public can insert; admin can read/manage
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can send contact messages" ON contacts
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "Authenticated users can manage contacts" ON contacts
  FOR ALL USING (auth.role() = 'authenticated');
