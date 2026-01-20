"use client";

import { useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";

// Mock Data (until we connect API)
const MOCK_RESULTS = [
    {
        id: "1",
        name: "Barilla Spaghetti n.5 (500g)",
        brand: "Barilla",
        image: "https://m.media-amazon.com/images/I/61S+0-S4SJL.jpg",
        prices: [
            { store: "Carrefour", price: 1.20, isCheapest: false },
            { store: "Conad", price: 1.35, isCheapest: false },
            { store: "Todis", price: 0.99, isCheapest: true },
        ]
    },
    {
        id: "2",
        name: "Coca-Cola Original Taste (1.5L)",
        brand: "Coca-Cola",
        image: "https://m.media-amazon.com/images/I/51v8nyxSOYL._SL1500_.jpg",
        prices: [
            { store: "Carrefour", price: 1.80, isCheapest: true },
            { store: "Conad", price: 2.10, isCheapest: false },
        ]
    },
    {
        id: "3",
        name: "Mutti Tomato Puree (700g)",
        brand: "Mutti",
        image: "https://m.media-amazon.com/images/I/71wF7+b7HwL._AC_SL1500_.jpg",
        prices: [
            { store: "Carrefour", price: 1.45, isCheapest: false },
            { store: "Todis", price: 1.15, isCheapest: true },
            { store: "Glovo", price: 1.60, isCheapest: false },
        ]
    }
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(MOCK_RESULTS);

    // Simple client-side filter for demo
    useEffect(() => {
        if (!query) {
            setResults(MOCK_RESULTS);
            return;
        }
        const filtered = MOCK_RESULTS.filter(r =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.brand.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Search Bar */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur-md transition-colors">
                <div className="mx-auto max-w-2xl py-2">
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        placeholder="Search for pasta, milk, coffee..."
                    />
                </div>
            </div>

            {/* Results Grid */}
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">
                        {query ? `Results for "${query}"` : "Popular Comparisons"}
                    </h1>
                    <span className="text-sm text-gray-500">{results.length} products</span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                {results.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-500">No products found matching your search.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setQuery("")}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
