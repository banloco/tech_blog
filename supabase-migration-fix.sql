-- Migration corrigée pour ajouter les colonnes manquantes
-- À exécuter dans le SQL Editor de Supabase

-- 1. AJOUTER LES COLONNES MANQUANTES À COMMENTS
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_reported BOOLEAN DEFAULT FALSE;

-- 2. AJOUTER LES INDEX
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 3. AJOUTER LA FONCTION POUR LES LIKES
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. AJOUTER LES COLONNES MANQUANTES À POSTS (si nécessaire)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. AJOUTER LA CONTRAINTE DE STATUS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'posts_status_check'
  ) THEN
    ALTER TABLE posts ADD CONSTRAINT posts_status_check 
    CHECK (status IN ('draft', 'published'));
  END IF;
END $$;

-- 6. METTRE À JOUR LES POSTS EXISTANTS
UPDATE posts SET status = 'published' WHERE status IS NULL;
UPDATE posts SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- 7. AJOUTER LES INDEX POUR POSTS
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- 8. CRÉER LA FONCTION POUR LES VUES
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

-- 9. CRÉER LA FONCTION POUR LES LIKES DE POSTS
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. NEWSLETTER SUBSCRIBERS TABLE
-- Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ajouter la colonne is_active si elle n'existe pas
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- FIN DE LA MIGRATION
-- Si tout s'est bien passé, vous devriez voir "Success ✅"
