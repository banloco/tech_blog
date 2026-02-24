-- Migration: add published_at to posts
-- Run this in your Supabase SQL editor (or via psql)

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Backfill: for already-published articles, use created_at as the publication date
UPDATE posts
SET published_at = created_at
WHERE status = 'published' AND published_at IS NULL;

-- Index for fast ordering in the sitemap / feeds
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC NULLS LAST);
