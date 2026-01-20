
import json
import os
from execution.supabase_client import get_supabase
from execution.price_engine import PriceEngine
from execution.nutrition_engine import NutritionEngine

class RecipeEngine:
    def __init__(self):
        self.supabase = get_supabase()
        self.price_engine = PriceEngine() 
        self.nutrition_engine = NutritionEngine()

    def find_cheapest_product(self, ingredient_name):
        """
        Finds the cheapest product matching the ingredient name.
        Uses naive partial matching for now via PriceEngine.
        """
        # Clean ingredient name: "1 cup generic pasta" -> "pasta"
        query_term = ingredient_name.split()[-1] 
        if len(query_term) < 3 and len(ingredient_name.split()) > 1:
            query_term = ingredient_name.split()[-2]
            
        # Use our robust PriceEngine logic
        results = self.price_engine.search_products(query_term)
        
        if results:
            best = results[0] # Sorted by cheapest first
            return {
               "found": True,
               "product_name": best['name'],
               "price": best['price'],
               "store": best['store'],
               "image": best['image']
            }
        return {"found": False, "price": 0.0, "reason": "Not found in stores"}

    def calculate_recipe_cost(self, recipe_id):
        # 1. Get Recipe
        res = self.supabase.table("recipes").select("title, serving_size").eq("id", recipe_id).execute()
        if not res.data:
            return None
        recipe = res.data[0]
        title = recipe["title"]
        servings = recipe["serving_size"]
        
        # 2. Get Ingredients
        res_ing = self.supabase.table("recipe_ingredients").select("ingredient_name, quantity").eq("recipe_id", recipe_id).execute()
        ingredients = res_ing.data
        
        total_cost = 0.0
        breakdown = []
        nutrition_input = []
        
        for ing in ingredients:
            ing_name = ing["ingredient_name"]
            qty = ing["quantity"]
            
            # Costing
            match = self.find_cheapest_product(ing_name)
            cost = match['price']
            total_cost += cost
            
            # Prepare for Nutrition
            nutrition_input.append({
                "ingredient": ing_name,
                "quantity": qty
            })
            
            breakdown.append({
                "ingredient": ing_name,
                "quantity": qty,
                "match": match
            })
            
        # 3. Calculate Nutrition
        nutrition_totals = self.nutrition_engine.estimate_total_nutrition(nutrition_input)
            
        return {
            "recipe": title,
            "servings": servings,
            "total_estimated_cost": round(total_cost, 2),
            "cost_per_serving": round(total_cost / servings, 2) if servings else 0,
            "nutrition_per_serving": {
                k: round(v / servings, 1) if servings else 0 for k,v in nutrition_totals.items()
            },
            "nutrition_total": nutrition_totals,
            "ingredients": breakdown
        }

if __name__ == "__main__":
    engine = RecipeEngine()
    
    # Test with a known ID (fetch one from DB)
    supabase = get_supabase()
    res = supabase.table("recipes").select("id").limit(1).execute()
    
    if res.data:
        first_id = res.data[0]['id']
        print(f"--- Costing Recipe ID: {first_id} ---")
        cost = engine.calculate_recipe_cost(first_id)
        print(json.dumps(cost, indent=2))
    else:
        print("No recipes in DB.")
