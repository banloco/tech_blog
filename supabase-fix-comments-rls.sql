-- Fix: RLS policy for anonymous comment insertion
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Make sure RLS is enabled on the comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 2. Drop and recreate INSERT policy to allow any visitor (anon) to post a comment
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Ensure the SELECT policy exists (approved comments visible to everyone)
DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
CREATE POLICY "Public can read approved comments"
  ON comments
  FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- 4. Ensure authenticated admins can do everything
DROP POLICY IF EXISTS "Authenticated users can manage comments" ON comments;
CREATE POLICY "Authenticated users can manage comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Verify policies are in place
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'comments'
ORDER BY policyname;
