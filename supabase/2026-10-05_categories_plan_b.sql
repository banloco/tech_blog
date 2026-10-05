-- One-off: switch an existing database to the "Le Plan B" themes.
-- Removes the categories of the earlier versions of the blog (finance, then tech in Africa).
-- Articles are kept: one in a removed category just ends up without a category
-- (ON DELETE SET NULL), and you can pick a new one in the editor.
BEGIN;

DELETE FROM categories
WHERE slug NOT IN ('gagner-de-l-argent', 'finances-perso', 'productivite', 'outils-ia');

INSERT INTO categories (name, slug, color, bg, border) VALUES
  ('Gagner de l''argent',  'gagner-de-l-argent', '#0E7A4B', 'rgba(14,122,75,0.08)',  'rgba(14,122,75,0.25)'),
  ('Finances perso',       'finances-perso',     '#B45309', 'rgba(180,83,9,0.08)',   'rgba(180,83,9,0.25)'),
  ('Productivité',         'productivite',       '#1D4ED8', 'rgba(29,78,216,0.08)',  'rgba(29,78,216,0.25)'),
  ('Outils & IA gratuits', 'outils-ia',          '#7C3AED', 'rgba(124,58,237,0.08)', 'rgba(124,58,237,0.25)')
ON CONFLICT DO NOTHING;

COMMIT;

SELECT name, slug FROM categories ORDER BY name;
