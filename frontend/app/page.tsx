"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealsCarousel } from "@/components/DealsCarousel";

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

      {/* 2. DAILY DEALS (Real Data) */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🔥 Today's Top Deals</h2>
            <p className="text-gray-500">Prices verified recently</p>
          </div>
        </div>

        {/* Horizontal Scroll / Grid */}
        <DealsCarousel />
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
