import time
import json
from execution.supabase_client import get_supabase
from execution.price_engine import PriceEngine
from execution.recipe_engine import RecipeEngine
from execution.cart_optimizer import CartOptimizer

def run_verification():
    print("🔎 STARTING DEEP VERIFICATION...\n")
    supabase = get_supabase()
    
    # 1. DATABASE HEALTH
    print("1️⃣  Checking Database Integrity...")
    products_count = supabase.table("products").select("id", count="exact").execute().count
    recipes_count = supabase.table("recipes").select("id", count="exact").execute().count
    
    print(f"   ✅ Products: {products_count}")
    print(f"   ✅ Recipes: {recipes_count}")
    
    if products_count == 0:
        print("   ❌ CRITICAL: No products found. Did migration fail?")
    else:
        # Check Carrefour specifically
        carrefour_count = supabase.table("products").select("id", count="exact").eq("store", "Carrefour IT").execute().count
        print(f"   ✅ Carrefour Items: {carrefour_count}")
        if carrefour_count == 0:
             print("   ⚠️ WARNING: No 'Carrefour IT' products found. Check scraper.")

    # 2. ENGINE LATENCY TEST
    print("\n2️⃣  Checking Engine Performance & Logic...")
    
    # Price Engine
    start = time.time()
    pe = PriceEngine()
    pasta_results = pe.search_products("Pasta")
    duration = time.time() - start
    print(f"   ✅ PriceEngine ('Pasta'): Found {len(pasta_results)} items in {duration:.2f}s")
    if duration > 1.0:
        print("   ⚠️ LATENCY WARNING: Search took > 1s. Indexing needed?")
        
    # Recipe Engine
    start = time.time()
    re = RecipeEngine()
    # Fetch first recipe ID
    first_recipe = supabase.table("recipes").select("id, title").limit(1).execute()
    if first_recipe.data:
        rid = first_recipe.data[0]['id']
        rtitle = first_recipe.data[0]['title']
        cost = re.calculate_recipe_cost(rid)
        duration = time.time() - start
        
        print(f"   ✅ RecipeEngine ('{rtitle}'): €{cost['total_estimated_cost']} ({duration:.2f}s)")
        
        # Coverage Check
        missing = [i['ingredient'] for i in cost['ingredients'] if not i['match']['found']]
        if missing:
             print(f"   ⚠️ WARNING: Missing ingredients for this recipe: {missing}")
        else:
             print("   ✅ All ingredients found in store!")
    else:
        print("   ❌ Recipe Check Skipped (No recipes in DB)")

    # Cart Optimizer
    start = time.time()
    co = CartOptimizer()
    cart = co.optimize_cart(["Milk", "Eggs", "Bread"])
    duration = time.time() - start
    print(f"   ✅ CartOptimizer (3 items): €{cart['total_cost']:.2f} ({duration:.2f}s)")

    # 3. SECURITY & CONFIG CHECK
    print("\n3️⃣  Security & Config Check...")
    # Check if RLS is effectively on (Standard supabase keys usually bypass RLS if service_role, but we check availability)
    try:
        # Try to read users table (should fail or return empty if we were generic user, but we are admin here)
        # We just check explicit env vars
        import os
        if not os.getenv("SUPABASE_SERVICE_ROLE_KEY"):
             print("   ❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY missing.")
        else:
             print("   ✅ Service Role Key present.")
    except Exception as e:
        print(f"   ⚠️ Config Warning: {e}")

    print("\n🏁 VERIFICATION COMPLETE.")

if __name__ == "__main__":
    run_verification()
