from execution.user_profile import UserProfileManager
from execution.recipe_engine import RecipeEngine
from execution.cart_optimizer import CartOptimizer
from collections import defaultdict
import re

class SmartListBuilder:
    def __init__(self):
        self.profile_mgr = UserProfileManager()
        self.recipe_engine = RecipeEngine()
        self.cart_optimizer = CartOptimizer()

    def parse_quantity(self, qty_str):
        """
        Parses "200g" -> (200, "g") or "2 cups" -> (2, "cups")
        Very basic heuristic for MVP.
        """
        # Remove whitespace
        if not qty_str:
            return 1.0, ""
            
        try:
            # Find numbers
            match = re.search(r"([\d\.]+)", qty_str)
            if match:
                num = float(match.group(1))
                unit = qty_str.replace(match.group(1), "").strip()
                return num, unit
        except:
            pass
        return 1.0, ""

    def scale_quantity(self, qty_str, multiplier):
        """
        Scales a quantity string by the multiplier.
        "200g" * 2 -> "400.0g"
        """
        val, unit = self.parse_quantity(qty_str)
        new_val = val * multiplier
        # Format nicely 
        if new_val.is_integer():
            return f"{int(new_val)}{unit}"
        return f"{new_val:.1f}{unit}"

    def build_weekly_shop(self, user_id, recipe_ids):
        """
        Input: User ID, List of Recipe IDs (e.g. ["carbonara-123", "salad-456"])
        Output: Optimized Shopping List with scaled quantities.
        """
        # 1. Calculate Scaling for each recipe
        aggregated_ingredients = defaultdict(list)
        
        for rid in recipe_ids:
            # Get Recipe Details
            cost_data = self.recipe_engine.calculate_recipe_cost(rid)
            if not cost_data:
                print(f"⚠️ Recipe {rid} not found.")
                continue
                
            servings = cost_data['servings']
            multiplier = self.profile_mgr.calculate_portion_multiplier(user_id, servings)
            
            print(f"Scaling '{cost_data['recipe']}' by {multiplier}x")
            
            # Aggregate Ingredients
            for item in cost_data['ingredients']:
                name = item['ingredient']
                original_qty = item['quantity']
                scaled_qty = self.scale_quantity(original_qty, multiplier)
                
                aggregated_ingredients[name].append({
                    "original_qty": original_qty,
                    "scaled_qty": scaled_qty,
                    "recipe": cost_data['recipe']
                })

        # 2. Build the Raw List for Optimizer
        # Flatten for CartOptimizer (which currently just needs names to find cheapest)
        # Future: Pass quantity to ensure we buy enough packs (e.g. 2x 500g pasta)
        shopping_list_names = list(aggregated_ingredients.keys())
        
        # 3. Optimize Prices
        optimized_cart = self.cart_optimizer.optimize_cart(shopping_list_names)
        
        return {
            "meta": {
                "user_id": user_id,
                "recipes_count": len(recipe_ids)
            },
            "shopping_list": aggregated_ingredients,
            "optimized_cart": optimized_cart
        }

if __name__ == "__main__":
    # TEST HARNESS
    builder = SmartListBuilder()
    
    # We need a valid recipe ID. Let's fetch one from DB to be safe
    from execution.supabase_client import get_supabase
    sp = get_supabase()
    res = sp.table("recipes").select("id").limit(1).execute()
    
    if res.data:
        rid = res.data[0]['id']
        fake_uid = "00000000-0000-0000-0000-000000000000"
        
        print(f"--- Building Smart List for Recipe {rid} ---")
        result = builder.build_weekly_shop(fake_uid, [rid])
        
        print("✅ Smart List Built!")
        print(f"Total Estimated Cost: €{result['optimized_cart']['total_cost']:.2f}")
    else:
        print("No recipes in DB to test.")
