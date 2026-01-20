"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock response simulating "cart_optimizer.py"
const MOCK_OPTIMIZATION = {
    saved: 8.50,
    total_original: 45.20,
    total_optimized: 36.70,
    stores: [
        {
            name: "Todis",
            total: 15.50,
            color: "bg-blue-600",
            items: [
                { name: "Milk (1L)", price: 0.99 },
                { name: "Eggs (6 pack)", price: 1.50 },
                { name: "Bread", price: 1.10 },
                { name: "Generic Pasta (500g)", price: 0.65 },
            ]
        },
        {
            name: "Carrefour",
            total: 21.20,
            color: "bg-blue-800",
            items: [
                { name: "Barilla Sauce", price: 1.80 },
                { name: "Chicken Breast", price: 5.50 },
                { name: "Olive Oil", price: 4.90 },
                { name: "Coffee", price: 3.50 },
            ]
        }
    ]
};

export default function SmartCartPage() {
    const [input, setInput] = useState("");
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [result, setResult] = useState<typeof MOCK_OPTIMIZATION | null>(null);

    const handleOptimize = () => {
        if (!input) return;
        setIsOptimizing(true);
        // Simulate API delay
        setTimeout(() => {
            setResult(MOCK_OPTIMIZATION);
            setIsOptimizing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-emerald-900 px-4 py-8 text-white shadow-lg">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold font-heading">Smart Cart Optimizer</h1>
                    <p className="mt-2 text-emerald-100">Paste your list. We'll tell you where to buy what.</p>
                </div>
            </div>

            <main className="mx-auto max-w-4xl px-4 py-8">

                {/* INPUT SECTION */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Your Shopping List (One item per line or comma separated)
                    </label>
                    <textarea
                        className="min-h-[150px] w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="e.g. Milk, Eggs, Bread, Pasta, Chicken, Olive Oil..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={handleOptimize}
                            disabled={isOptimizing || !input}
                            size="lg"
                            className={isOptimizing ? "opacity-80" : ""}
                        >
                            {isOptimizing ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Crunching Numbers...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    Optimize My Cart
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* RESULTS SECTION */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        {/* Savings Banner */}
                        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-100">Total Savings</p>
                                    <p className="text-4xl font-extrabold">€{result.saved.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-emerald-100 line-through">Estimated: €{result.total_original.toFixed(2)}</p>
                                    <p className="text-xl font-bold">Pay Only: €{result.total_optimized.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Split View */}
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Your Action Plan</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {result.stores.map((store, idx) => (
                                <div key={idx} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className={`px-4 py-3 ${idx === 0 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">{store.name}</h3>
                                            <span className="text-sm font-semibold">€{store.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <ul className="space-y-3">
                                            {store.items.map((item, i) => (
                                                <li key={i} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                        <span className="text-gray-700">{item.name}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">€{item.price.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="mt-6 w-full" variant="outline" size="sm">
                                            Send List to WhatsApp
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
