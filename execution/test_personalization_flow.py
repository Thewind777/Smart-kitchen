from execution.supabase_client import get_supabase
from execution.user_profile import UserProfileManager
from execution.smart_list_builder import SmartListBuilder
import uuid
import time

def run_test():
    print("🧪 STARTING PERSONALIZATION FLOW TEST...")
    supabase = get_supabase()
    
    # 1. Create a Test Auth User (Requires Service Role)
    # random email to avoid collision
    test_email = f"test_user_{int(time.time())}@example.com"
    test_password = "password123"
    
    print(f"   👤 Creating Test User: {test_email}")
    try:
        user = supabase.auth.admin.create_user({
            "email": test_email,
            "password": test_password,
            "email_confirm": True
        })
        user_id = user.user.id
        print(f"      ✅ User Created: {user_id}")
    except Exception as e:
        print(f"      ❌ Failed to create user: {e}")
        return

    # 2. Create Profile (Family of 4)
    print("   👨‍👩‍👧‍👦 Setting Profile: Family of 4, Diet: Keto")
    pm = UserProfileManager()
    pm.create_or_update_profile(user_id, family_members=4, diet=["keto"])
    
    # 3. Fetch a Recipe (to test scaling)
    print("   🍝 Fetching a recipe to scale...")
    res = supabase.table("recipes").select("*").limit(1).execute()
    if not res.data:
        print("      ❌ No recipes in DB.")
        return
    
    recipe = res.data[0]
    rid = recipe['id']
    servings = recipe['serving_size']
    print(f"      Found: '{recipe['title']}' (Serves {servings})")
    
    # 4. Build Smart List
    print("   🛒 Building Smart List...")
    slb = SmartListBuilder()
    result = slb.build_weekly_shop(user_id, [rid])
    
    # 5. Verify Scaling
    # Expected Multiplier = 4 / servings (e.g. 4/4=1, 4/2=2)
    expected_mult = 4 / servings
    print(f"      Expected Multiplier: {expected_mult}x")
    
    shopping_list = result['shopping_list']
    
    passed = True
    for item_name, details in shopping_list.items():
        original = details[0]['original_qty'] # array logic in builder was append
        scaled = details[0]['scaled_qty']
        print(f"      - {item_name}: {original} -> {scaled}")
        
        # Simple string check (very naive, but proves change happened)
        if expected_mult != 1.0 and original == scaled and original != "":
             print("         ⚠️ WARNING: Quantity did not change?")
             passed = False

    if passed:
        print("\n✅ PERSONALIZATION TEST PASSED")
    else:
        print("\n❌ PERSONALIZATION TEST FAILED")

    # Cleanup (Optional: Delete user)
    # supabase.auth.admin.delete_user(user_id)

if __name__ == "__main__":
    run_test()
