-- Enable required extensions
create extension if not exists pg_trgm;

-- Add Full Text Search column to products table
alter table products
add column if not exists
  fts tsvector
  generated always as (to_tsvector('english', name || ' ' || store)) stored;

-- Create GIN index for Full Text Search (fast searching)
create index if not exists products_fts_idx on products using gin(fts);

-- Create trigram index for fuzzy matching (typo tolerance)
create index if not exists products_name_trgm_idx on products using gist(name gist_trgm_ops);

-- Price index for sorting
create index if not exists products_price_idx on products(price);

-- Store index for filtering
create index if not exists products_store_idx on products(store);
