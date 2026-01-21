"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Leaf } from "lucide-react";
import { Button } from "./ui/button";
import { useSettings } from "./SettingsProvider";

interface StorePrice {
  store: string;
  price: number;
  isCheapest: boolean;
}

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  brand: string;
  prices?: StorePrice[]; // Optional - for multi-store comparison
  // Mock Health Data for Demo
  macros?: { protein: number; carbs: number; fat: number; calories: number };
  healthScore?: "A" | "B" | "C" | "D" | "E";
  badges?: string[];
  // Single-store format (from API)
  price?: number;
  store?: string;
  savings?: number;
}

export function ProductCard({ name, image, brand, prices, price, store, macros, healthScore, badges }: ProductCardProps) {
  const { persona } = useSettings();

  // Normalize to prices array format
  const normalizedPrices = prices || (price !== undefined && store ? [{ store, price, isCheapest: true }] : []);

  // Find best price logic
  const bestPrice = normalizedPrices.length > 0 ? Math.min(...normalizedPrices.map((p) => p.price)) : 0;
  const savings = normalizedPrices.length > 0 ? Math.max(...normalizedPrices.map((p) => p.price)) - bestPrice : 0;

  // Default mocks if missing
  const demoMacros = macros || { protein: 12, carbs: 40, fat: 5, calories: 250 };
  const demoScore = healthScore || "B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
    >
      {/* Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-4">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {savings > 0 && (
          <div className="absolute top-2 left-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            Save €{savings.toFixed(2)}
          </div>
        )}

        {/* HEALTH OVERLAY - GYM RAT */}
        {persona === "gym-rat" && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 backdrop-blur-sm">
            <div className="flex justify-around text-center text-xs text-white">
              <div>
                <span className="block font-bold text-accent">{demoMacros.protein}g</span>
                <span className="text-[9px] uppercase opacity-70">Prot</span>
              </div>
              <div>
                <span className="block font-bold">{demoMacros.calories}</span>
                <span className="text-[9px] uppercase opacity-70">Kcal</span>
              </div>
            </div>
          </div>
        )}

        {/* HEALTH OVERLAY - MOM SAVER */}
        {persona === "mom-saver" && (
          <div className="absolute top-2 right-2 rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-800 border border-green-200 shadow-sm flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            Score: {demoScore}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 text-xs font-medium opacity-60">{brand}</div>
        <h3 className="mb-4 text-lg font-semibold leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Price Grid */}
        <div className="mt-auto space-y-2">
          {normalizedPrices.map((p, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${p.price === bestPrice
                ? "border border-primary/30 bg-primary/5 font-bold text-primary ring-1 ring-primary/20"
                : "opacity-80"
                }`}
            >
              <span>{p.store}</span>
              <span>€{p.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Button className="mt-4 w-full gap-2" size="sm">
          <ShoppingCart className="h-4 w-4" />
          Add Best Option
        </Button>
      </div>
    </motion.div>
  );
}
