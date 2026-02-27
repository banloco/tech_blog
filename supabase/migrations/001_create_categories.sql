-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  slug       text NOT NULL UNIQUE,
  color      text NOT NULL DEFAULT '#C19A6B',
  bg         text NOT NULL DEFAULT 'rgba(193,154,107,0.08)',
  border     text NOT NULL DEFAULT 'rgba(193,154,107,0.25)',
  created_at timestamptz DEFAULT now()
);

-- Seed default categories
INSERT INTO categories (name, slug, color, bg, border) VALUES
  ('IA',              'ia',              '#00E5FF',  'rgba(0,229,255,0.06)',   'rgba(0,229,255,0.2)'),
  ('Crypto',          'crypto',          '#a78bfa',  'rgba(167,139,250,0.06)', 'rgba(167,139,250,0.25)'),
  ('Algo Trading',    'algo-trading',    '#C19A6B',  'rgba(193,154,107,0.08)', 'rgba(193,154,107,0.25)'),
  ('Venture Capital', 'venture-capital', '#60a5fa',  'rgba(96,165,250,0.06)',  'rgba(96,165,250,0.25)'),
  ('Macro',           'macro',           '#9ca3af',  'rgba(156,163,175,0.06)', 'rgba(156,163,175,0.2)'),
  ('DeFi',            'defi',            '#a78bfa',  'rgba(167,139,250,0.06)', 'rgba(167,139,250,0.25)')
ON CONFLICT DO NOTHING;

-- Add category_id to posts table
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
