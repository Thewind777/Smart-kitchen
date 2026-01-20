import os
import requests
import json
import uuid
from execution.supabase_client import get_supabase
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class RecipeChatbot:
    def __init__(self):
        self.supabase = get_supabase()
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "meta-llama/llama-3-8b-instruct:free" # Backup Free Model

    def generate_recipe(self, user_prompt):
        """
        Generates a recipe from a prompt and saves it to DB.
        Returns: {id, title, status}
        """
        print(f"🤖 AI Generating Recipe for: '{user_prompt}' using {self.model}...")
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://rubycassini.com", 
            "X-Title": "Ruby Cassini"
        }
        
        system_prompt = """
        You are a professional chef. Create a recipe based on the user's request.
        You MUST output ONLY valid JSON. No markdown, no conversation.
        JSON Structure:
        {
            "title": "Recipe Name",
            "ingredients": [
                {"ingredient_name": "Spaghetti", "quantity": "200g"},
                {"ingredient_name": "Eggs", "quantity": "2 large"}
            ],
            "instructions": "Step 1... Step 2...",
            "prep_time": 15,
            "serving_size": 2
        }
        """
        
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code != 200:
                print(f"⚠️ OpenRouter Error ({response.status_code}): {response.text}")
                print("⚠️ Switching to MOCK MODE for demonstration.")
                return self._mock_recipe()
                
            data = response.json()
            if 'error' in data:
                 print(f"⚠️ OpenRouter API Error: {data['error']}")
                 return self._mock_recipe()
                 
            content = data['choices'][0]['message']['content']
            
            # Clean Markdown if present
            content = content.replace("```json", "").replace("```", "").strip()
            
            recipe_data = json.loads(content)
            
            # Save to Database
            return self._save_to_db(recipe_data)
            
        except Exception as e:
            print(f"⚠️ Chatbot Logic Error: {e}")
            return self._mock_recipe()

    def _mock_recipe(self):
        """
        Fallback recipe if AI fails.
        """
        mock_data = {
            "title": "Keto Scrambled Eggs (AI Demo)",
            "ingredients": [
                {"ingredient_name": "Eggs", "quantity": "3 large"},
                {"ingredient_name": "Butter", "quantity": "10g"},
                {"ingredient_name": "Spinach", "quantity": "50g"}
            ],
            "instructions": "1. Whisk eggs. 2. Melt butter. 3. Cook spinach. 4. Scramble eggs.",
            "prep_time": 5,
            "serving_size": 1
        }
        return self._save_to_db(mock_data)

    def _save_to_db(self, data):
        """
        Saves the structured recipe to Supabase.
        """
        # Generate ID (Using TheMealDB style logic or just UUID)
        # We used string IDs in table (TheMealDB IDs), so let's use UUID str
        recipe_id = str(uuid.uuid4())
        
        # 1. Insert Recipe
        recipe_row = {
            "id": recipe_id,
            "title": data.get("title", "AI Recipe"),
            "instructions": data.get("instructions", ""),
            "prep_time": data.get("prep_time", 0),
            "serving_size": data.get("serving_size", 1),
            "image_url": "https://placehold.co/600x400?text=AI+Generated" # Placeholder for now
        }
        self.supabase.table("recipes").insert(recipe_row).execute()
        
        # 2. Insert Ingredients
        ingredients = []
        for ing in data.get("ingredients", []):
            ingredients.append({
                "recipe_id": recipe_id,
                "ingredient_name": ing["ingredient_name"],
                "quantity": ing["quantity"]
            })
            
        if ingredients:
            self.supabase.table("recipe_ingredients").insert(ingredients).execute()
            
        print(f"✅ Recipe Saved: {recipe_row['title']} (ID: {recipe_id})")
        return {
            "success": True, 
            "id": recipe_id, 
            "title": recipe_row['title']
        }

if __name__ == "__main__":
    bot = RecipeChatbot()
    result = bot.generate_recipe("A healthy keto breakfast with eggs")
    print(json.dumps(result, indent=2))
