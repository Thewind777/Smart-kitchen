
import sqlite3
import requests
import os
import time

DB_PATH = os.path.join("data", "prices.db")
FOODISH_URL = "https://foodish-api.com/api/"

# Category keyword mapping to food types supported by Foodish
CATEGORY_MAP = {
    'pasta': 'pasta',
    'penne': 'pasta',
    'spaghetti': 'pasta',
    'fusilli': 'pasta',
    'rigatoni': 'pasta',
    'farfalle': 'pasta',
    'pizza': 'pizza',
    'dessert': 'dessert',
    'rice': 'rice',
    'burger': 'burger',
    'biryani': 'biryani',
    'butter-chicken': 'butter-chicken',
    'dosa': 'dosa',
    'idly': 'idly',
    'samosa': 'samosa'
}

def get_category(product_name):
    """Determine category from product name"""
    name_lower = product_name.lower()
    for keyword, category in CATEGORY_MAP.items():
        if keyword in name_lower:
            return category
    return None  # Generic food if no match

def fetch_foodish_image(category=None):
    """Fetch a random food image from Foodish API"""
    try:
        if category:
            url = f"{FOODISH_URL}{category}/"
        else:
            url = f"{FOODISH_URL}"  # Random food
        
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get('image')
    except Exception as e:
        print(f"  Error fetching Foodish: {e}")
    return None

def assign_placeholder_images():
    """Assign food images to products without any image"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    products = cursor.execute("SELECT id, name FROM products WHERE image_url IS NULL").fetchall()
    print(f"Assigning placeholder images to {len(products)} products...")
    
    success_count = 0
    for row in products:
        p_id, p_name = row
        category = get_category(p_name)
        
        print(f"Assigning to: {p_name[:40]}... ", end="")
        img = fetch_foodish_image(category)
        
        if img:
            cursor.execute("UPDATE products SET image_url = ? WHERE id = ?", (img, p_id))
            conn.commit()
            success_count += 1
            print("✅")
        else:
            print("❌")
        
        time.sleep(0.3)  # Be polite to the API
    
    conn.close()
    print(f"\nCompleted: {success_count}/{len(products)} images assigned")

if __name__ == "__main__":
    assign_placeholder_images()
