-- One-off: replace the old finance categories with the "Tech & business en Afrique" ones.
-- For a database created with an older schema.sql. Articles keep existing: an article in a
-- removed category just ends up without a category (ON DELETE SET NULL).
BEGIN;

DELETE FROM categories
WHERE slug IN ('ia', 'crypto', 'algo-trading', 'venture-capital', 'macro', 'defi');

INSERT INTO categories (name, slug, color, bg, border) VALUES
  ('Paiements & Mobile Money',   'paiements-mobile-money',   '#34d399', 'rgba(52,211,153,0.06)',  'rgba(52,211,153,0.25)'),
  ('Entrepreneuriat & business', 'entrepreneuriat-business', '#C19A6B', 'rgba(193,154,107,0.08)', 'rgba(193,154,107,0.25)'),
  ('Dev & tutos',                'dev-tutos',                '#60a5fa', 'rgba(96,165,250,0.06)',  'rgba(96,165,250,0.25)'),
  ('IA pratique',                'ia-pratique',              '#00E5FF', 'rgba(0,229,255,0.06)',   'rgba(0,229,255,0.2)')
ON CONFLICT DO NOTHING;

COMMIT;

SELECT name, slug FROM categories ORDER BY name;
