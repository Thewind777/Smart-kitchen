"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptimizationResult {
    saved: number;
    total_original: number;
    total_optimized: number;
    stores: Array<{
        store: string;
        total: number;
        items: Array<{
            name: string;
            price: number;
            originalQuery: string;
        }>;
    }>;
    notFound: string[];
}

export default function SmartCartPage() {
    const [input, setInput] = useState("");
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOptimize = async () => {
        if (!input) return;

        setIsOptimizing(true);
        setError(null);

        try {
            const items = input
                .split(/\n|,/)
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            if (items.length === 0) {
                setError("Please enter at least one item");
                setIsOptimizing(false);
                return;
            }

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });

            if (response.status === 429) {
                setError("Too many requests. Please wait a moment.");
                setIsOptimizing(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to optimize cart');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsOptimizing(false);
        }
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
                        >
                            {isOptimizing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
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

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                        <p className="mt-2 text-red-800">{error}</p>
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-100">Total Savings</p>
                                    <p className="text-4xl font-extrabold">€{result.saved.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-emerald-100 line-through">
                                        Estimated: €{result.total_original.toFixed(2)}
                                    </p>
                                    <p className="text-xl font-bold">Pay Only: €{result.total_optimized.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {result.notFound && result.notFound.length > 0 && (
                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-medium text-amber-800">
                                    Could not find: {result.notFound.join(", ")}
                                </p>
                            </div>
                        )}

                        <h2 className="mb-4 text-xl font-bold text-gray-900">Your Action Plan</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {result.stores.map((store, idx) => (
                                <div
                                    key={idx}
                                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                >
                                    <div
                                        className={`px-4 py-3 ${idx === 0 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">{store.store}</h3>
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
