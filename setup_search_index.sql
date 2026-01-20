-- Enable the pg_trgm extension for fuzzy string matching and similarity search
create extension if not exists pg_trgm;

-- Add a text search vector column to the products table if it doesn't exist
-- We'll try to use a generated column for automatic updates
alter table products 
add column if not exists fts tsvector 
generated always as (to_tsvector('english', name || ' ' || coalesce(brand, '') || ' ' || store)) stored;

-- Create a GIN index for fast full-text search
create index if not exists products_fts_idx on products using gin (fts);

-- Create a GIN index on the name column for trigram matching (fuzzy search/typo tolerance)
create index if not exists products_name_trgm_idx on products using gin (name gin_trgm_ops);

-- Performance: Index for price sorting (often used with search)
create index if not exists products_price_idx on products (price);

-- Safety: Verify the extension is active
select * from pg_extension where extname = 'pg_trgm';
