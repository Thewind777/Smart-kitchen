"use client";

import { motion } from "framer-motion";
import { Check, Palette, User, Heart } from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

const THEMES = [
    { id: "cozy", name: "Cozy Modern", desc: "Warm Cream & Vibrant Orange", color: "bg-[#FFFBF0]" },
    { id: "old-money", name: "Old Money", desc: "Ivory, Hunter Green & Gold", color: "bg-[#FDFCF8]" },
    { id: "tech", name: "Cyber Tech", desc: "Dark Mode with Neon Accents", color: "bg-[#09090B]" },
    { id: "luxury", name: "Quiet Luxury", desc: "Minimalist Black & White", color: "bg-[#FFFFFF]" },
];

const PERSONAS = [
    { id: "generic", name: "Standard", desc: "Balanced mix of savings and quality." },
    { id: "mom-saver", name: "Super Mom", desc: "Focus on Health Score (A-F) & fiber/sugar labels." },
    { id: "gym-rat", name: "Gym Rat", desc: "Show me Protein/Macros first. I count every gram." },
    { id: "student", name: "Broke Student", desc: "Price per calorie. Cheapest possible options." },
];

export default function SettingsPage() {
    const { theme, setTheme, persona, setPersona } = useSettings();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-primary px-4 py-8 text-primary-foreground shadow-lg transition-colors">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-3xl font-bold font-heading">Personalize App</h1>
                    <p className="mt-2 opacity-90">Make Ruby Cassini look and feel like YOURS.</p>
                </div>
            </div>

            <main className="mx-auto max-w-2xl px-4 py-8 space-y-10">

                {/* THEME SELECTOR */}
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Visual Theme</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id as any)}
                                className={`relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${theme === t.id
                                        ? "border-primary ring-2 ring-primary ring-offset-2"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className={`h-12 w-12 rounded-full border border-gray-100 shadow-inner ${t.color}`} />
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.desc}</div>
                                </div>
                                {theme === t.id && (
                                    <div className="absolute top-4 right-4 text-primary">
                                        <Check className="h-5 w-5" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* PERSONA SELECTOR */}
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Your Goal</h2>
                    </div>
                    <div className="space-y-3">
                        {PERSONAS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPersona(p.id as any)}
                                className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${persona === p.id
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">{p.name}</div>
                                    <div className="text-sm text-gray-500">{p.desc}</div>
                                </div>
                                {persona === p.id && (
                                    <div className="rounded-full bg-primary p-1 text-white">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
