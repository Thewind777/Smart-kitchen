"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, AlertCircle } from "lucide-react";

interface Product {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    store: string;
    original_price?: number;
    savings: number;
}

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300); // CFO requirement: prevent hammering API
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchResults() {
            if (!debouncedQuery) {
                setResults([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/search?query=${encodeURIComponent(debouncedQuery)}`
                );

                if (response.status === 429) {
                    setError("Too many requests. Please wait a moment.");
                    setIsLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                // Transform API response to match ProductCard format
                const transformedResults = data.results.map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    image: product.image,
                    prices: [
                        {
                            store: product.store,
                            price: product.price,
                            isCheapest: true, // The API returns sorted by price
                        },
                    ],
                }));

                setResults(transformedResults);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

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

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                        <p className="mt-2 text-red-800">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setQuery("")}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}

                {/* Results */}
                {!isLoading && !error && results.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {results.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && results.length === 0 && query && (
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
