
import json
import os
from execution.supabase_client import get_supabase

# CONFIG
# DB_PATH is no longer needed

class PriceEngine:
    def __init__(self):
        self.supabase = get_supabase()

    def search_products(self, query, filters=None):
        """
        Search for products across all stores using Supabase (Postgres).
        filters: dict -> {'keto': True, 'diabetes_safe': True}
        """
        # 1. Base Query
        # Using 'ilike' for case-insensitive partial match
        clean_query = f"%{query}%"
        
        # We start building the query
        db_query = self.supabase.table("products").select("*").ilike("name", clean_query)
        
        # 2. Apply Filters
        # Assuming we have these columns in DB now, if not we mock filter locally for MVP safety
        # BUT for Supabase, we should try to filter on server side if possible.
        # For MVP, let's fetch results and filter python side if columns don't exist yet, 
        # but migrating script put 'nutriscore' in.
        
        # Execute Query
        response = db_query.execute()
        rows = response.data
        
        results = []
        for row in rows:
            # Map Row to Standard Dict
            p_id = row.get("id")
            name = row.get("name")
            brand = row.get("brand") # Might be missing in current schema
            store = row.get("store")
            price = row.get("price")
            orig_price = row.get("original_price") # Might be null/missing
            img = row.get("image_url")
            
            # Local Filter Logic (until we add explicit boolean columns to DB Schema)
            if filters:
                if filters.get('keto') and 'pasta' in name.lower() and 'keto' not in name.lower():
                    continue 
                if filters.get('diabetes_safe') and 'sugar' in name.lower() and 'zero' not in name.lower():
                    continue

            results.append({
                "id": p_id,
                "name": name,
                "brand": brand or "Generic",
                "store": store,
                "price": price,
                "original_price": orig_price,
                "image": img,
                "savings": round(orig_price - price, 2) if (orig_price and price) else 0
            })
            
        # 3. Sort by Price (Cheapest First)
        results.sort(key=lambda x: x['price'])
        
        return results

if __name__ == "__main__":
    # TEST HARNESS
    engine = PriceEngine()
    print("--- Searching for 'Pasta' ---")
    results = engine.search_products("Pasta")
    print(json.dumps(results[:3], indent=2))
