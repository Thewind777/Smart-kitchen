"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. HERO SECTION */}
      <section className="bg-white px-4 pt-12 pb-16 text-center shadow-sm sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Smart Savings for <span className="text-primary">Savvy Families</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Compare prices across Carrefour, Conad, and Todis instantly.
            Stop overpaying for groceries.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="rounded-full px-8 shadow-emerald-200">
                <Search className="mr-2 h-5 w-5" />
                Start Comparing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. DAILY DEALS (Mock) */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 Today's Top Deals</h2>
            <p className="text-gray-500">Prices verified 2 hours ago</p>
          </div>
          <Button variant="ghost" className="text-primary">View All</Button>
        </div>

        {/* Horizontal Scroll / Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-3 left-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                SAVE €2.50
              </div>
              <div className="aspect-video w-full bg-gray-100 p-4">
                <img
                  src={`https://placehold.co/600x400?text=Deal+${i}`}
                  alt="Deal"
                  className="h-full w-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">Lavazza Coffee Beans (1kg)</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 line-through">€14.99</span>
                    <span className="text-xl font-bold text-primary">€12.49</span>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Grab It
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VALUE PROPS */}
      <section className="bg-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold">Why use Ruby Cassini?</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <TrendingDown className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Best Price Guaranteed</h3>
              <p className="mt-2 text-emerald-200">We track prices 24/7 so you never miss a drop.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Smart Split</h3>
              <p className="mt-2 text-emerald-200">We tell you exactly which store to buy each item at.</p>
            </div>
            {/* ... */}
          </div>
        </div>
      </section>
    </div>
  );
}
