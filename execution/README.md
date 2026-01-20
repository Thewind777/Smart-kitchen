# 🚀 Ruby Cassini Backend - Execution Guide

This folder contains the core logic for the Ruby Cassini food-tech backend.
All scripts are connected to **Supabase** (Postgres) and use **OpenFoodFacts** / **OpenRouter**.

## 🛠️ Setup
1. Ensure `.env` is present in the root directory (contains SUPABASE keys).
2. Install dependencies:
   ```bash
   pip install supabase requests python-dotenv
   ```

## 🧠 Core Engines

### 1. Price Engine
Searches for products and finds the cheapest prices across stores (Carrefour, Glovo, etc.).
```bash
python -m execution.price_engine
```

### 2. Recipe Engine (+ Nutrition)
Calculates the cost of a recipe using real store prices AND estimates nutrition (Calories/Macros).
```bash
python -m execution.recipe_engine
```

### 3. Cart Optimizer
Optimizes a shopping list by finding "Generic Swaps" (cheaper items) and splitting the cart.
```bash
python -m execution.cart_optimizer
```

## 👤 Personalization & AI

### 1. User Profile
Manages family size and dietary restrictions.
```bash
python -m execution.user_profile
```

### 2. Smart List Builder (The "Magic")
Takes a generic recipe, scales it for your family size (e.g. 4 people), and optimizes the cost.
```bash
python -m execution.test_personalization_flow
```

### 3. AI Recipe Chatbot
Generates new recipes from prompts.
*Note: Currently in DEMO MODE if OpenRouter Key is invalid.*
```bash
python -m execution.recipe_chatbot
```

## ✅ Verification
Run these to check health:
```bash
python -m execution.verify_integrity  # Data Quality Check
python -m execution.stress_test       # Load Test (50 concurrent)
```
