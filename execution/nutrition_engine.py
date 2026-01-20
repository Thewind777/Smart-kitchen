import requests
import re

class NutritionEngine:
    def __init__(self):
        self.api_url = "https://world.openfoodfacts.org/cgi/search.pl"
        self.cache = {} # Simple in-memory cache

    def fetch_macros(self, ingredient_name):
        """
        Fetch nutritional info for a generic ingredient.
        Returns per 100g: {calories, protein, fat, carbs}
        """
        if ingredient_name in self.cache:
            return self.cache[ingredient_name]

        # Cleanup name: "1 cup chopped onion" -> "onion"
        clean_name = ingredient_name.split()[-1]
        
        params = {
            "search_terms": clean_name,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": 1
        }
        
        try:
            response = requests.get(self.api_url, params=params, timeout=5)
            data = response.json()
            
            if data['products']:
                product = data['products'][0]
                nutriments = product.get('nutriments', {})
                
                # Extract Kcal (energy-kcal_100g)
                # Fallback to energy_100g / 4.184 if kcal missing
                kcal = nutriments.get('energy-kcal_100g', 0)
                if not kcal:
                    kcal = nutriments.get('energy_100g', 0) / 4.184
                
                macros = {
                    "calories": int(kcal),
                    "protein": float(nutriments.get('proteins_100g', 0)),
                    "fat": float(nutriments.get('fat_100g', 0)),
                    "carbs": float(nutriments.get('carbohydrates_100g', 0))
                }
                
                self.cache[ingredient_name] = macros
                return macros
                
        except Exception as e:
            print(f"⚠️ Nutrition Fetch Error ({ingredient_name}): {e}")
            
        # Fallback empty
        return {"calories": 0, "protein": 0, "fat": 0, "carbs": 0}

    def estimate_total_nutrition(self, recipe_ingredients):
        """
        recipe_ingredients: list of dicts [{'ingredient': 'pasta', 'quantity': '200g'}, ...]
        Returns summed up macros for the whole recipe.
        """
        total = {"calories": 0, "protein": 0, "fat": 0, "carbs": 0}
        
        for item in recipe_ingredients:
            name = item['ingredient']
            qty_str = item['quantity']
            
            # Simple Parser: Extract grams or ml
            # If "cup", assume 200g roughly for MVP
            weight_g = 100 # Default fallback
            
            match = re.search(r"(\d+)", qty_str)
            if match:
                val = float(match.group(1))
                if 'kg' in qty_str: weight_g = val * 1000
                elif 'g' in qty_str: weight_g = val
                elif 'lb' in qty_str: weight_g = val * 453
                elif 'oz' in qty_str: weight_g = val * 28
                elif 'cup' in qty_str: weight_g = val * 200
                elif 'tbsp' in qty_str: weight_g = val * 15
                else: weight_g = val # Assume grams if raw number?
            
            macros_per_100g = self.fetch_macros(name)
            multiplier = weight_g / 100.0
            
            total["calories"] += macros_per_100g["calories"] * multiplier
            total["protein"] += macros_per_100g["protein"] * multiplier
            total["fat"] += macros_per_100g["fat"] * multiplier
            total["carbs"] += macros_per_100g["carbs"] * multiplier
            
        # Round results
        for k in total:
            total[k] = round(total[k], 1)
            
        return total

if __name__ == "__main__":
    ne = NutritionEngine()
    print("--- Searching 'Spaghetti' ---")
    print(ne.fetch_macros("Spaghetti"))
    
    print("\n--- Estimating Recipe ---")
    ingredients = [
        {"ingredient": "Spaghetti", "quantity": "200g"},
        {"ingredient": "Tomato Sauce", "quantity": "100g"}
    ]
    print(ne.estimate_total_nutrition(ingredients))
