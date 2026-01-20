
import requests
from bs4 import BeautifulSoup
import json
import sqlite3
import time
import random
from datetime import datetime

# Database setup
DB_PATH = "data/prices.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def save_product(product_data, url):
    conn = get_db_connection()
    c = conn.cursor()
    
    # Parse price
    try:
        price = float(product_data.get('price', 0))
    except ValueError:
        price = 0.0

    name = product_data.get('name')
    store = "Carrefour IT"
    
    # Extract Image (Try multiple keys common in Demandware/SFCC)
    image_url = product_data.get('image')
    if not image_url and 'images' in product_data:
        # Sometimes it's a list or dict
        imgs = product_data['images']
        if isinstance(imgs, list) and len(imgs) > 0:
            image_url = imgs[0].get('url') or imgs[0].get('link')
        elif isinstance(imgs, dict):
             # Try 'large', 'medium', 'small' keys
             image_url = imgs.get('large', {}).get('url') or imgs.get('medium', {}).get('url')

    # Ensure absolute URL if it's relative
    if image_url and not image_url.startswith('http'):
        if image_url.startswith('//'):
             image_url = 'https:' + image_url
        else:
             image_url = 'https://www.carrefour.it' + image_url

    # Check for duplicate (Name + Store) to avoid bloat
    c.execute("SELECT id FROM products WHERE name = ? AND store = ?", (name, store))
    existing = c.fetchone()
    
    if existing:
        # Update Price & Image
        c.execute("""
            UPDATE products 
            SET price = ?, timestamp = ?, image_url = COALESCE(?, image_url)
            WHERE id = ?
        """, (price, datetime.now().isoformat(), image_url, existing['id']))
        print(f"[UPDATED] {name} - €{price}")
    else:
        # Insert New
        c.execute('''
            INSERT INTO products (name, price, currency, unit, store, timestamp, original_url, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name,
            price,
            "EUR",
            product_data.get('dimension52', 'unit'),
            store,
            datetime.now().isoformat(),
            url,
            image_url
        ))
        print(f"[SAVED] {name} - €{price}")
    
    conn.commit()
    conn.close()

def scrape_category(base_url):
    print(f"Scraping category: {base_url}")
    category_id = base_url.strip('/').split('/')[-1]
    
    # Demandware AJAX Endpoint
    target_url = f"https://www.carrefour.it/on/demandware.store/Sites-carrefour-IT-Site/it_IT/Search-UpdateGrid?cgid={category_id}&start=0&sz=100"
    
    print(f"Trying AJAX Endpoint: {target_url}")
    
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
    ]
    
    headers = {
        'User-Agent': random.choice(user_agents),
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
    }

    try:
        response = requests.get(target_url, headers=headers, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch {target_url}: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Strategy: data-product-json on <article>
    articles = soup.find_all('article', attrs={'data-product-json': True})
    
    if not articles:
        print("No articles with data-product-json found.")
        return

    print(f"Found {len(articles)} products.")
    
    count = 0
    for article in articles:
        raw_json = article['data-product-json']
        try:
            data = json.loads(raw_json)
            save_product(data, base_url)
            count += 1
        except json.JSONDecodeError:
            continue
            
    print(f"Successfully scraped {count} items from {base_url}")

if __name__ == "__main__":
    # Full list of categories
    CATEGORIES = [
        "frutta-e-verdura", "carne", "pesce", "salumi-e-formaggi",
        "uova-latte-e-latticini", "dolci-e-prima-colazione",
        "pasta-riso-e-farina", "gastronomia", "acqua-e-analcolici",
        "condimenti-e-conserve", "pane-e-snack-salati",
        "gelati-e-surgelati", "birra-vino-e-liquori",
        "cura-della-casa", "cura-della-persona"
    ]
    
    print(f"Starting STEALTH bulk scrape for {len(CATEGORIES)} categories...")
    print("NOTE: Delays increased to 10-20s to simulate human behavior.")
    
    for category in CATEGORIES:
        url = f"https://www.carrefour.it/spesa-online/{category}/"
        scrape_category(url)
        
        sleep_time = random.uniform(10, 20)
        print(f"Stealth delay: Sleeping for {sleep_time:.2f}s...")
        time.sleep(sleep_time)

    print("Bulk scrape completed.")
