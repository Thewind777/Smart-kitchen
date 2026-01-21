import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/rate-limit';

// Input validation schema
const recipesSchema = z.object({
    limit: z.number().int().min(1).max(100).optional().default(10),
    dietary: z.enum(['keto', 'vegetarian', 'vegan', 'gluten-free']).optional(),
});

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        // 1. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await ratelimit.limit(ip);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }

        // 2. Input Validation
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const dietary = searchParams.get('dietary') || undefined;

        const validation = recipesSchema.safeParse({ limit, dietary });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid parameters', details: validation.error.issues },
                { status: 400 }
            );
        }

        // 3. Create Supabase client per request (RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: request.headers.get('Authorization') || '',
                    },
                },
            }
        );

        // 4. Fetch recipes from database
        let query = supabase
            .from('recipes')
            .select('id, title, serving_size, prep_time, cook_time, cuisine, diet_type, image_url')
            .limit(validation.data.limit);

        // Apply dietary filter if specified
        if (validation.data.dietary) {
            query = query.eq('diet_type', validation.data.dietary);
        }

        const { data: recipes, error } = await query;

        if (error) {
            console.error('[API_ERROR]', {
                endpoint: '/api/recipes',
                error: error.message,
                latency: Date.now() - startTime,
            });

            return NextResponse.json(
                { error: 'Failed to fetch recipes' },
                { status: 500 }
            );
        }

        // 5. For each recipe, calculate cost and nutrition
        const enrichedRecipes = await Promise.all(
            (recipes || []).map(async (recipe) => {
                // Fetch ingredients for this recipe
                const { data: ingredients } = await supabase
                    .from('recipe_ingredients')
                    .select('ingredient_name, quantity')
                    .eq('recipe_id', recipe.id);

                // Calculate total cost by finding cheapest product for each ingredient
                let totalCost = 0;
                let foundProducts = 0;

                if (ingredients) {
                    for (const ingredient of ingredients) {
                        // Simple search for ingredient (using last word)
                        const searchTerm = ingredient.ingredient_name.split(' ').pop() || ingredient.ingredient_name;

                        const { data: products } = await supabase
                            .from('products')
                            .select('price')
                            .textSearch('fts', searchTerm)
                            .order('price', { ascending: true })
                            .limit(1);

                        if (products && products.length > 0) {
                            totalCost += products[0].price;
                            foundProducts++;
                        }
                    }
                }

                // Return enriched recipe
                return {
                    id: recipe.id,
                    title: recipe.title,
                    servings: recipe.serving_size,
                    prepTime: recipe.prep_time,
                    cookTime: recipe.cook_time,
                    cuisine: recipe.cuisine,
                    dietType: recipe.diet_type,
                    image: recipe.image_url || 'https://foodish-api.com/images/pizza/pizza1.jpg',
                    cost: {
                        total: Math.round(totalCost * 100) / 100,
                        perServing: Math.round((totalCost / (recipe.serving_size || 1)) * 100) / 100,
                        ingredientsFound: foundProducts,
                        ingredientsTotal: ingredients?.length || 0,
                    },
                    // Placeholder nutrition (would call OpenFoodFacts in production)
                    nutrition: {
                        calories: 450,
                        protein: 25,
                        carbs: 40,
                        fat: 15,
                    },
                };
            })
        );

        // Structured logging
        console.log('[API_SUCCESS]', {
            endpoint: '/api/recipes',
            count: enrichedRecipes.length,
            latency: Date.now() - startTime,
        });

        return NextResponse.json({
            recipes: enrichedRecipes,
            count: enrichedRecipes.length,
        });
    } catch (error) {
        console.error('[API_ERROR]', {
            endpoint: '/api/recipes',
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
