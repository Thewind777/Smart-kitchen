"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, Droplets, Flame, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data for Planner
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface PlannedMeal {
    id: string;
    name: string;
    type: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    cost: number;
    time: number; // mins
    tags: string[]; // Keto, High Protein, etc.
}

const SAMPLE_MEALS: Record<string, PlannedMeal[]> = {
    "Mon": [
        { id: "1", name: "Oatmeal & Berries", type: "Breakfast", calories: 350, protein: 12, carbs: 60, fat: 6, cost: 1.20, time: 10, tags: ["Healthy", "High Fiber"] },
        { id: "2", name: "Chicken Salad", type: "Lunch", calories: 450, protein: 40, carbs: 10, fat: 15, cost: 3.50, time: 15, tags: ["High Protein", "Low Carb"] },
    ]
};

export default function MealPlannerPage() {
    const [selectedDay, setSelectedDay] = useState("Mon");

    // Stats Calculation
    const dailyMeals = SAMPLE_MEALS[selectedDay] || [];
    const totalCals = dailyMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = dailyMeals.reduce((acc, m) => acc + m.protein, 0);
    const totalCost = dailyMeals.reduce((acc, m) => acc + m.cost, 0);

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
                            <div className="text-xs text-gray-500">Goal Progress</div>
                            <div className="text-lg font-bold text-primary">On Track</div>
                        </div>
                    </div>
                </div>

                {/* Meals List */}
                <div className="space-y-4">
                    {MEAL_TYPES.map((type) => {
                        const meals = dailyMeals.filter(m => m.type === type);
                        return (
                            <div key={type} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-700">{type}</h3>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 rounded-full">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {meals.length > 0 ? meals.map((meal) => (
                                        <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{meal.name}</h4>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {meal.tags.map(t => (
                                                        <span key={t} className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                        <Flame className="h-3 w-3" /> {meal.calories}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">€{meal.cost.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">{meal.time} min</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-sm text-gray-400 italic">
                                            Nothing planned yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </main>
        </div>
    );
}
