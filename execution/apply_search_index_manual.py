import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from root
load_dotenv(dotenv_path="../.env")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY") # Use Service Key for DDL operations if possible, otherwise Query

if not url or not key:
    print("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY (or ANON)")
    exit(1)

supabase: Client = create_client(url, key)

SQL_FILE = "../setup_search_index.sql"

def apply_sql():
    print(f"📡 Connecting to Supabase at {url}...")
    
    try:
        with open(SQL_FILE, 'r') as f:
            sql_content = f.read()
            
        # Split by statements to run one by one (primitive SQL runner)
        # Or usually Supabase Python client doesn't support raw SQL easily without RPC.
        # We will try to use the raw SQL function if enabled, or postgres connection.
        # Since we migrated to Supabase-py, we might not have direct SQL execution exposed unless we have a helper.
        # Actually, let's try to use the `rpc` call if there is one, OR just use standard psycopg2 if we have the connection string.
        # BUT, for this environment, we might not have psycopg2 installed. 
        # Let's check if we can run query via REST or if we need to print instructions.
        
        # NOTE: standard supabase-js/py client routes usually don't run arbitrary DDL SQL. 
        # We will try to print it for the user or assume we have a postgres connection string in .env?
        # Checking implementation_plan... we migrated using 'supabase-py'.
        
        # Let's try to use the postgres library we used for migration if available.
        # If not, we provided the SQL file.
        
        print(f"✅ SQL File created at: {os.path.abspath(SQL_FILE)}")
        print("⚠️  Supabase-py client does not support raw DDL execution via REST API.")
        print("👉  Please go to the Supabase SQL Editor and Copy/Paste the content of 'setup_search_index.sql'")
        
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    apply_sql()
