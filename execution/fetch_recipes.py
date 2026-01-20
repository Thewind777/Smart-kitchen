
import sqlite3
import requests
import os

DB_PATH = os.path.join("data", "prices.db")
MEALDB_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian"
MEALDB_LOOKUP_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    return conn

def fetch_italian_recipes():
    print("Fetching Italian recipes from TheMealDB...")
    response = requests.get(MEALDB_URL)
    data = response.json()
    meals = data.get("meals", [])
    print(f"Found {len(meals)} Italian recipes.")
    return meals

def get_recipe_details(meal_id):
    response = requests.get(f"{MEALDB_LOOKUP_URL}{meal_id}")
    data = response.json()
    return data["meals"][0] if data.get("meals") else None

def save_recipes(meals):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    count = 0
    for meal_summary in meals:
        meal_id = meal_summary['idMeal']
        details = get_recipe_details(meal_id)
        
        if not details:
            continue
            
        title = details['strMeal']
        image = details['strMealThumb']
        instructions = details['strInstructions']
        
        print(f"Saving: {title}")
        
        # Insert Recipe
        cursor.execute("""
            INSERT OR REPLACE INTO recipes (id, title, image_url, instructions, prep_time, serving_size)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (meal_id, title, image, instructions, 30, 4)) # Default 30min, 4 servings as API doesn't always provide
        
        # Insert Ingredients
        # TheMealDB returns ingredients as strIngredient1, strIngredient2, etc.
        for i in range(1, 21):
            ing_name = details.get(f"strIngredient{i}")
            ing_measure = details.get(f"strMeasure{i}")
            
            if ing_name and ing_name.strip():
                cursor.execute("""
                    INSERT OR REPLACE INTO recipe_ingredients (recipe_id, ingredient_name, quantity)
                    VALUES (?, ?, ?)
                """, (meal_id, ing_name.strip(), ing_measure.strip() if ing_measure else ""))
        
        count += 1
        
    conn.commit()
    conn.close()
    print(f"Successfully saved {count} recipes.")

if __name__ == "__main__":
    meals = fetch_italian_recipes()
    save_recipes(meals)
