import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/rate-limit';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Rate Limiting (max 5 generations per hour)
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await ratelimit.limit(`recipe-gen:${ip}`);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again in an hour.' },
                { status: 429 }
            );
        }

        // 2. Create Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 3. Parse request body
        const body = await request.json();
        const { count = 1, persona = 'family-first' } = body;

        // 4. Generate recipes using OpenRouter AI
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [{
                    role: 'user',
                    content: `Generate ${count} healthy, budget-friendly recipe(s) for a "${persona}" persona. 
                    
For each recipe, provide:
- Title
- Servings (2-4)
- Prep time (minutes)
- Cook time (minutes)
- Estimated cost per serving (€0.50 - €3.00)
- Nutrition (calories, protein, carbs, fat per serving)
- Ingredients list with quantities
- Brief cooking instructions

Format as JSON array. Example:
[{
  "title": "Quick Chicken Stir Fry",
  "servings": 4,
  "prepTime": 15,
  "cookTime": 10,
  "costPerServing": 2.50,
  "nutrition": {"calories": 350, "protein": 30, "carbs": 25, "fat": 12},
  "ingredients": ["300g chicken breast", "2 bell peppers", "1 onion", "200g rice"],
  "instructions": "1. Cook rice. 2. Stir fry chicken and veggies. 3. Serve."
}]`
                }]
            })
        });

        if (!openRouterResponse.ok) {
            throw new Error('AI generation failed');
        }

        const aiData = await openRouterResponse.json();
        const recipesText = aiData.choices[0]?.message?.content;

        // Parse AI response
        const recipes = JSON.parse(recipesText.replace(/```json\n?|\n?```/g, ''));

        // 5. Insert recipes into database
        const insertedRecipes = [];
        for (const recipe of recipes) {
            const { data, error } = await supabase
                .from('recipes')
                .insert({
                    title: recipe.title,
                    servings: recipe.servings,
                    prep_time: recipe.prepTime,
                    cook_time: recipe.cookTime,
                    cost_per_serving: recipe.costPerServing,
                    cost_total: recipe.costPerServing * recipe.servings,
                    calories: recipe.nutrition.calories,
                    protein: recipe.nutrition.protein,
                    carbs: recipe.nutrition.carbs,
                    fat: recipe.nutrition.fat,
                    image_url: `https://foodish-api.com/images/pizza/pizza${Math.floor(Math.random() * 10) + 1}.jpg`,
                })
                .select()
                .single();

            if (data && !error) {
                insertedRecipes.push(data);
            }
        }

        console.log('[API_SUCCESS]', {
            endpoint: '/api/recipes/generate',
            count: insertedRecipes.length,
            latency: Date.now() - startTime,
        });

        return NextResponse.json({
            success: true,
            recipes: insertedRecipes,
            message: `Generated ${insertedRecipes.length} recipe(s)`,
        });

    } catch (error) {
        console.error('[API_ERROR]', {
            endpoint: '/api/recipes/generate',
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: 'Failed to generate recipes' },
            { status: 500 }
        );
    }
}
