
import requests
import json

def test_search(query):
    print(f"Searching Open Food Facts for: {query}")
    
    # Open Food Facts Search API
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 1
    }
    
    headers = {
        "User-Agent": "RubyCassini/0.1 (feras@example.com)" # Polite UA
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("count", 0) > 0:
            product = data["products"][0]
            print("\n✅ Match Found!")
            print(f"Name: {product.get('product_name')}")
            print(f"Nutriscore: {product.get('nutriscore_grade', 'N/A')}")
            print(f"Image: {product.get('image_url', 'N/A')}")
            
            nutriments = product.get("nutriments", {})
            print(f"Calories (100g): {nutriments.get('energy-kcal_100g', 'N/A')}")
        else:
            print("❌ No results found.")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_search("Barilla Penne Rigate")
    test_search("Coca Cola Zero")
