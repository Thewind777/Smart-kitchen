
import sqlite3
import requests
import time
import re
import os

DB_PATH = os.path.join("data", "prices.db")
OFF_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def clean_product_name(name):
    # Aggressive simplification: Take first 3 words only
    # "Barilla Penne Rigate 500g n.5" -> "Barilla Penne Rigate"
    words = name.split()
    return " ".join(words[:3])

def search_off(query):
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 1
    }
    headers = { "User-Agent": "RubyCassini/0.1 (feras@example.com)" }
    
    try:
        response = requests.get(OFF_SEARCH_URL, params=params, headers=headers, timeout=15)
        if response.status_code == 200:
            data = response.json()
            if data.get("count", 0) > 0:
                return data["products"][0]
    except Exception as e:
        print(f"  Error searching OFF: {e}")
    return None

def enrich_products():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get unenriched products
    # Limit to 50 for this run to avoid hitting rate limits too hard/taking too long
    products = cursor.execute("SELECT * FROM products WHERE last_enriched IS NULL LIMIT 50").fetchall()
    
    print(f"Found {len(products)} products to enrich.")

    for product in products:
        original_name = product['name']
        clean_name = clean_product_name(original_name)
        
        print(f"Enriching: '{original_name}' -> Search: '{clean_name}'")
        
        off_data = search_off(clean_name)
        
        if off_data:
            print(f"  ✅ Found: {off_data.get('product_name')} (Nutriscore: {off_data.get('nutriscore_grade')})")
            
            # Extract Data
            nutriscore = off_data.get('nutriscore_grade')
            image_url = off_data.get('image_url')
            calories = off_data.get('nutriments', {}).get('energy-kcal_100g')
            
            # Update DB
            cursor.execute("""
                UPDATE products 
                SET calories_100g = ?, nutriscore = ?, image_url = ?, last_enriched = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (calories, nutriscore, image_url, product['id']))
            conn.commit()
        else:
            print("  ❌ No match found.")
            # Mark as enriched anyway so we don't retry forever
            cursor.execute("UPDATE products SET last_enriched = CURRENT_TIMESTAMP WHERE id = ?", (product['id'],))
            conn.commit()
            
        time.sleep(1.2) # Polite rate limit

    conn.close()
    print("Enrichment batch complete.")

if __name__ == "__main__":
    enrich_products()
