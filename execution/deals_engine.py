import sqlite3
import json
import os

# CONFIG
DB_PATH = os.path.join("data", "prices.db")

class DealsEngine:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        
    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def get_daily_deals(self, min_discount=0.3):
        """
        Get products with at least `min_discount` (30%).
        """
        conn = self._get_connection()
        cursor = conn.cursor()
        
        sql = """
            SELECT p.id, p.name, p.brand, s.name as store, pr.price, pr.original_price, p.image_url
            FROM products p
            JOIN prices pr ON p.id = pr.product_id
            JOIN stores s ON pr.store_id = s.id
            WHERE pr.original_price > 0 
            AND (1 - (pr.price / pr.original_price)) >= ?
            ORDER BY (1 - (pr.price / pr.original_price)) DESC
            LIMIT 20
        """
        
        cursor.execute(sql, (min_discount,))
        rows = cursor.fetchall()
        
        deals = []
        for row in rows:
            p_id, name, brand, store, price, orig, img = row
            discount_pct = round((1 - (price / orig)) * 100)
            
            deals.append({
                "product": name,
                "store": store,
                "price": price,
                "old_price": orig,
                "discount": f"{discount_pct}% OFF",
                "image": img
            })
            
        conn.close()
        return deals

if __name__ == "__main__":
    engine = DealsEngine()
    print("--- Todays Top Deals ---")
    print(json.dumps(engine.get_daily_deals(), indent=2))
