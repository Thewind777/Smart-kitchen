
import sqlite3
import os

DB_PATH = os.path.join("data", "prices.db")

def migrate():
    print(f"Migrating database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Add Columns to 'products' table
    # We use a try/except block because SQLite doesn't support "IF NOT EXISTS" for ADD COLUMN
    new_columns = [
        ("calories_100g", "INTEGER"),
        ("nutriscore", "TEXT"),
        ("image_url", "TEXT"),
        ("last_enriched", "TIMESTAMP")
    ]

    for col_name, col_type in new_columns:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            print(f"Added column: {col_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column" in str(e).lower():
                print(f"Column already exists: {col_name}")
            else:
                print(f"Error adding {col_name}: {e}")

    # 2. Create 'recipes' table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipes (
        id TEXT PRIMARY KEY,
        title TEXT,
        image_url TEXT,
        instructions TEXT,
        prep_time INTEGER,
        serving_size INTEGER
    )
    """)
    print("Ensured 'recipes' table exists.")

    # 3. Create 'recipe_ingredients' table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
        recipe_id TEXT,
        ingredient_name TEXT,
        quantity TEXT,
        FOREIGN KEY(recipe_id) REFERENCES recipes(id)
    )
    """)
    print("Ensured 'recipe_ingredients' table exists.")

    conn.commit()
    conn.close()
    print("Migration V2 completed successfully.")

if __name__ == "__main__":
    migrate()
