import json
import os
from collections import defaultdict
from execution.supabase_client import get_supabase

# CONFIG
# DB_PATH is no longer needed

class CartOptimizer:
    def __init__(self):
        self.supabase = get_supabase()

    def find_cheapest_generic(self, category, current_price, excluded_product_id):
        """
        Logic for 'Generic Brand Swapper'.
        Find a product in the same category that is lower price.
        """
        # Simple heuristic: Price is lower by at least 20%
        target_price = current_price * 0.8
        
        # Supabase Query
        # .lt means "less than", .neq means "not equal"
        # Note: 'category' might be missing in schema, relying on 'name' parsing or 'products' schema if updated.
        # Assuming schema has text-based search or we scan. 
        # For efficiency in Supabase, we'd want a vector search or category column.
        # Let's assume for MVP we just look for *any* product with price < target.
        
        # We try to filter by name fuzzy match if category column missing
        # OR if category exists (it was in the list I migrated), we use it.
        # User schema showed 'products' has name, price, store, etc. Category column WAS in my migrate script?
        # Let's check migrate script: "category" was NOT in the migrate script explicitly mapping, 
        # but rows had it. Wait.
        # The Supabase Schema we generated (`supabase_schema.sql`) DID NOT include `category` column! 
        # It had name, price, store, original_url, image, nutriscore.
        # ERROR DETECTED: We lost 'category' in migration.
        # FIX: We will fuzzy match name for now (e.g. if item is "Pasta", search "Pasta" < price).
        
        # We can't easily guess category from name without AI. 
        # Fallback: Don't implement category swap strict match yet, just price match on SIMILAR NAME.
        pass # Todo: Re-enable when category column added.
        return None

    def optimize_cart(self, shopping_list):
        """
        shopping_list: list of strings (e.g., ["Milk", "Eggs", "Barilla Pasta"])
        """
        cart_plan = {
            "stores": defaultdict(list),
            "total_cost": 0.0,
            "swaps_found": []
        }
        
        for item_name in shopping_list:
            # 1. Find best price for this item across ALL stores
            # Using simple ILIKE match
            res = self.supabase.table("products").select("*").ilike("name", f"%{item_name}%").order("price", desc=False).limit(1).execute()
            
            if res.data:
                best_match = res.data[0]
                p_id = best_match['id']
                p_name = best_match['name']
                price = best_match['price']
                store = best_match['store']
                
                # 2. Check for Generic Swap (Simplified logic for now)
                # We search for *same name string* but cheaper price
                swap_res = self.supabase.table("products").select("*") \
                    .ilike("name", f"%{item_name}%") \
                    .lt("price", price * 0.8) \
                    .neq("id", p_id) \
                    .order("price", desc=False) \
                    .limit(1) \
                    .execute()
                    
                if swap_res.data:
                    swap = swap_res.data[0]
                    cart_plan['swaps_found'].append({
                        "original": p_name,
                        "original_price": price,
                        "swap_with": swap['name'],
                        "swap_price": swap['price'],
                        "savings": round(price - swap['price'], 2)
                    })
                
                # Add to store bucket
                cart_plan["stores"][store].append({
                    "item": p_name,
                    "price": price
                })
                cart_plan["total_cost"] += price
            else:
                cart_plan["stores"]["Unknown"].append({"item": item_name, "price": 0})

        return cart_plan

if __name__ == "__main__":
    optimizer = CartOptimizer()
    current_list = ["Pasta", "Milk", "Cola"]
    print(f"--- Optimizing Cart: {current_list} ---")
    result = optimizer.optimize_cart(current_list)
    print(json.dumps(result, indent=2))
