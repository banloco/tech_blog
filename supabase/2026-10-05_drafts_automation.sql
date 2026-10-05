-- Lets the writing agents drop articles as DRAFTS, through the public API, with a secret token.
-- The token can only create drafts: it can't publish, edit or delete anything, and drafts stay
-- invisible to visitors until you publish them from /admin.
--
-- Run this file once in the Supabase SQL Editor. Then add your token (NOT in this file, the repo
-- is public):
--   INSERT INTO automation_tokens (token, label) VALUES ('your-long-random-token', 'agents');

BEGIN;

-- Focus keyword of each article (filled in the editor's SEO panel, or by the agents)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

CREATE TABLE IF NOT EXISTS automation_tokens (
  token      TEXT PRIMARY KEY,
  label      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE automation_tokens ENABLE ROW LEVEL SECURITY;  -- no policy: unreadable through the API

-- Titles already written (drafts included), so an agent never writes the same article twice
CREATE OR REPLACE FUNCTION list_post_titles(p_token TEXT)
RETURNS TABLE (title TEXT, slug TEXT, status TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM automation_tokens t WHERE t.token = p_token) THEN
    RAISE EXCEPTION 'invalid token' USING ERRCODE = '28000';
  END IF;
  RETURN QUERY SELECT p.title, p.slug, p.status, p.created_at FROM posts p ORDER BY p.created_at DESC;
END;
$$;

-- Create a draft. Returns its slug (made unique if needed).
CREATE OR REPLACE FUNCTION create_draft(
  p_token            TEXT,
  p_title            TEXT,
  p_slug             TEXT,
  p_content          TEXT,
  p_excerpt          TEXT DEFAULT NULL,
  p_category_slug    TEXT DEFAULT NULL,
  p_tags             TEXT[] DEFAULT '{}',
  p_meta_title       TEXT DEFAULT NULL,
  p_meta_description TEXT DEFAULT NULL,
  p_focus_keyword    TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug TEXT := lower(regexp_replace(coalesce(nullif(p_slug, ''), p_title), '[^a-zA-Z0-9]+', '-', 'g'));
  v_category UUID;
  v_n INT := 1;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM automation_tokens t WHERE t.token = p_token) THEN
    RAISE EXCEPTION 'invalid token' USING ERRCODE = '28000';
  END IF;
  IF length(coalesce(p_title, '')) < 10 OR length(coalesce(p_content, '')) < 2000 THEN
    RAISE EXCEPTION 'title or content too short';
  END IF;

  v_slug := trim(both '-' from v_slug);
  WHILE EXISTS (SELECT 1 FROM posts WHERE slug = v_slug) LOOP  -- keep slugs unique
    v_n := v_n + 1;
    v_slug := regexp_replace(v_slug, '-[0-9]+$', '') || '-' || v_n;
  END LOOP;

  SELECT id INTO v_category FROM categories WHERE slug = p_category_slug;

  INSERT INTO posts (title, slug, content, excerpt, category_id, tags, status, meta_title, meta_description, focus_keyword)
  VALUES (p_title, v_slug, p_content, p_excerpt, v_category, coalesce(p_tags, '{}'), 'draft',
          coalesce(p_meta_title, p_title), coalesce(p_meta_description, p_excerpt), p_focus_keyword);
  RETURN v_slug;
END;
$$;

REVOKE ALL ON FUNCTION list_post_titles(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_draft(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION list_post_titles(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_draft(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT) TO anon, authenticated;

COMMIT;
