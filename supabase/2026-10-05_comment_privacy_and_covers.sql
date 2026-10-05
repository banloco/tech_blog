-- 1. Commenters' emails: visitors (anon key) can read approved comments but not the
--    author_email column. The admin, logged in, keeps full access.
-- 2. create_draft accepts a cover image: articles must have one.
BEGIN;

REVOKE SELECT ON comments FROM anon;
GRANT SELECT (id, post_id, parent_id, author_name, content, likes_count, is_approved, is_reported, created_at)
  ON comments TO anon;

DROP FUNCTION IF EXISTS create_draft(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT);

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
  p_focus_keyword    TEXT DEFAULT NULL,
  p_cover_image      TEXT DEFAULT NULL
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
  IF p_cover_image IS NOT NULL AND p_cover_image !~ '^https://' THEN
    RAISE EXCEPTION 'cover image must be an https URL';
  END IF;

  v_slug := trim(both '-' from v_slug);
  WHILE EXISTS (SELECT 1 FROM posts WHERE slug = v_slug) LOOP  -- keep slugs unique
    v_n := v_n + 1;
    v_slug := regexp_replace(v_slug, '-[0-9]+$', '') || '-' || v_n;
  END LOOP;

  SELECT id INTO v_category FROM categories WHERE slug = p_category_slug;

  INSERT INTO posts (title, slug, content, excerpt, cover_image, category_id, tags, status, meta_title, meta_description, focus_keyword)
  VALUES (p_title, v_slug, p_content, p_excerpt, p_cover_image, v_category, coalesce(p_tags, '{}'), 'draft',
          coalesce(p_meta_title, p_title), coalesce(p_meta_description, p_excerpt), p_focus_keyword);
  RETURN v_slug;
END;
$$;

REVOKE ALL ON FUNCTION create_draft(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_draft(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';
