from execution.supabase_client import get_supabase

class UserProfileManager:
    def __init__(self):
        self.supabase = get_supabase()

    def get_profile(self, user_id):
        """
        Fetch user profile settings (family size, diet).
        """
        response = self.supabase.table("profiles").select("*").eq("id", user_id).execute()
        if response.data:
            return response.data[0]
        return None

    def create_or_update_profile(self, user_id, family_members=1, diet=None):
        """
        Upsert profile data.
        """
        data = {
            "id": user_id,
            "family_members": family_members,
            "dietary_restrictions": diet or []
        }
        # Upsert = Insert if new, Update if exists
        self.supabase.table("profiles").upsert(data).execute()
        return data

    def calculate_portion_multiplier(self, user_id, recipe_servings):
        """
        Returns the multiplier needed to scale a recipe for this family.
        e.g. Recipe serves 2, Family is 4 -> Multiplier = 2.0
        """
        profile = self.get_profile(user_id)
        if not profile:
            return 1.0 # Default to as-is if no profile
            
        family_size = profile.get("family_members", 1)
        
        if not recipe_servings or recipe_servings == 0:
            return 1.0
            
        return round(family_size / recipe_servings, 2)

if __name__ == "__main__":
    # Test Harness (Mocking a user ID since we don't have a real one handy without logging in)
    # We will use a fake UUID for testing if RLS allows service_role to bypass (it does)
    fake_uid = "00000000-0000-0000-0000-000000000000" 
    
    manager = UserProfileManager()
    
    print(f"Creating profile for {fake_uid} (Family of 4, Keto)...")
    manager.create_or_update_profile(fake_uid, family_members=4, diet=["keto"])
    
    profile = manager.get_profile(fake_uid)
    print(f"Fetched Profile: {profile}")
    
    # Test Scaling
    recipe_serves = 2
    mult = manager.calculate_portion_multiplier(fake_uid, recipe_serves)
    print(f"Recipe serves {recipe_serves}, Family is 4 -> Multiplier: {mult}x")
