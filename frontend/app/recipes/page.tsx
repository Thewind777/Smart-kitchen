"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Droplets, Flame, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Recipe {
    id: string;
    title: string;
    servings: number;
    prepTime: number;
    cookTime: number;
    cost: {
        total: number;
        perServing: number;
    };
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    image: string;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MealPlannerPage() {
    const [selectedDay, setSelectedDay] = useState("Mon");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch recipes from API
    useEffect(() => {
        async function loadRecipes() {
            try {
                const response = await fetch('/api/recipes?limit=20');
                if (!response.ok) throw new Error('Failed to load recipes');

                const data = await response.json();
                setRecipes(data.recipes || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load recipes');
            } finally {
                setIsLoading(false);
            }
        }

        loadRecipes();
    }, []);

    // Calculate daily stats (placeholder - will be real when meal planning is implemented)
    const totalCals = recipes.slice(0, 3).reduce((acc, r) => acc + r.nutrition.calories, 0);
    const totalProtein = recipes.slice(0, 3).reduce((acc, r) => acc + r.nutrition.protein, 0);
    const totalCost = recipes.slice(0, 3).reduce((acc, r) => acc + r.cost.total, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <h1 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Meal Planner
                    </h1>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Generate Week
                    </Button>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
                {/* Day Selector */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-x-auto">
                    {WEEK_DAYS.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`min-w-[3rem] flex-1 rounded-xl py-2 text-sm font-medium transition-all ${selectedDay === day
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Daily Stats Summary */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                            <Flame className="h-3 w-3 text-orange-500" /> Calories
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{totalCals}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                            <Activity className="h-3 w-3 text-emerald-500" /> Protein
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{totalProtein}g</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                            <Droplets className="h-3 w-3 text-blue-500" /> Cost
                        </div>
                        <div className="text-2xl font-bold text-gray-900">€{totalCost.toFixed(2)}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-xs text-gray-500">Available Recipes</div>
                            <div className="text-lg font-bold text-primary">{recipes.length}</div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Recipes List */}
                {!isLoading && !error && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Available Recipes</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="aspect-video bg-gray-100">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900">{recipe.title}</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                <Flame className="h-3 w-3" /> {recipe.nutrition.calories} cal
                                            </span>
                                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                                                {recipe.nutrition.protein}g protein
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                                                €{recipe.cost.perServing.toFixed(2)}/serving
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                                            <span>{recipe.servings} servings</span>
                                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {recipes.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500">No recipes available yet.</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Click "Generate Week" to create recipes with AI
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
