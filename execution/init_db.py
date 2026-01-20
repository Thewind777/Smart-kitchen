import sqlite3
import os

DB_PATH = 'data/prices.db'

def init_db():
    if not os.path.exists('data'):
        os.makedirs('data')
        
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Create Products Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'EUR',
            unit TEXT,
            store TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            original_url TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
