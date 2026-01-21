"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Deal {
    id: string;
    name: string;
    brand: string;
    store: string;
    price: number;
    originalPrice: number;
    image: string;
    savings: number;
    savingsPercent: number;
}

export function DealsCarousel() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDeals() {
            try {
                const response = await fetch('/api/deals');
                if (!response.ok) throw new Error('Failed to fetch deals');

                const data = await response.json();
                setDeals(data.deals.slice(0, 3)); // Take top 3 for homepage
            } catch (error) {
                console.error('Failed to load deals:', error);
                setDeals([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDeals();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (deals.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No deals available right now. Check back soon!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {deals.map((deal) => (
                <div
                    key={deal.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                        SAVE €{deal.savings.toFixed(2)}
                    </div>
                    <div className="aspect-video w-full bg-gray-100 p-4">
                        <img
                            src={deal.image}
                            alt={deal.name}
                            className="h-full w-full object-cover mix-blend-multiply"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{deal.name}</h3>
                        <p className="text-xs text-gray-500">{deal.store}</p>
                        <div className="mt-2 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 line-through">
                                    €{deal.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-xl font-bold text-primary">
                                    €{deal.price.toFixed(2)}
                                </span>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-full">
                                View
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
