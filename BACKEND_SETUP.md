# Backend Migration: Phase 5 - Manual Setup Steps

## ⚠️ IMPORTANT: Database Index Setup Required

Before the Search API will work correctly, you **must** apply the Full Text Search index to your Supabase database.

### Step 1: Apply Search Index SQL

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `tqqluowrtaveukcrgiiz`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `setup_search_index.sql` (located in the project root)
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify Index Creation

Run this query in the SQL Editor to confirm:

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products' 
AND indexname LIKE '%fts%';
```

You should see the `products_fts_idx` index listed.

### Step 3: Test the API

Once the index is applied:

```bash
# Local testing
npm run dev
node execution/test_api_search.js

# Production testing (after Cloudflare deployment)
API_BASE_URL=https://your-app.pages.dev node execution/test_api_search.js
```

## Why Manual Setup?

The Supabase REST API doesn't support DDL (Data Definition Language) operations like `CREATE EXTENSION` or `CREATE INDEX`. These must be run directly in the SQL Editor with elevated privileges.

## Learnings

**Date**: 2026-01-20  
**Issue**: Cannot automate Postgres schema changes via REST API  
**Solution**: Documented manual SQL steps. Consider using Supabase CLI migrations for future projects.
