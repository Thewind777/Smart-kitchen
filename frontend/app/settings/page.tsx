"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Palette, User, Heart, LogIn, LogOut } from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

const THEMES = [
    { id: "cozy", name: "Cozy Modern", desc: "Warm Cream & Vibrant Orange", color: "bg-[#FFFBF0]" },
    { id: "old-money", name: "Old Money", desc: "Ivory, Hunter Green & Gold", color: "bg-[#FDFCF8]" },
    { id: "tech", name: "Cyber Tech", desc: "Dark Mode with Neon Accents", color: "bg-[#09090B]" },
    { id: "luxury", name: "Quiet Luxury", desc: "Minimalist Black & White", color: "bg-[#FFFFFF]" },
];

const PERSONAS = [
    { id: "family-first", name: "Family First", desc: "Balanced savings and quality for the household." },
    { id: "keto-warrior", name: "Keto Warrior", desc: "Low-carb, high-fat focus. Show net carbs first." },
    { id: "gym-rat", name: "Gym Rat", desc: "High protein. I count every macro." },
    { id: "old-money", name: "Old Money", desc: "Premium brands, value-conscious luxury." },
    { id: "budget-hero", name: "Budget Hero", desc: "Price per calorie. Cheapest wins." },
];

export default function SettingsPage() {
    const { theme, setTheme, persona, setPersona } = useSettings();
    const { user, signOut } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-primary px-4 py-8 text-primary-foreground shadow-lg transition-colors">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-3xl font-bold font-heading">Personalize App</h1>
                    <p className="mt-2 opacity-90">Make Ruby Cassini look and feel like YOURS.</p>
                </div>
            </div>

            <main className="mx-auto max-w-2xl px-4 py-8 space-y-10">

                {/* AUTH SECTION */}
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Account</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        {user ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">Signed in</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                                <Button onClick={signOut} variant="outline" size="sm" className="gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-gray-900">Not signed in</div>
                                    <div className="text-sm text-gray-500">
                                        Sign in to save your preferences
                                    </div>
                                </div>
                                <Button onClick={() => setShowAuthModal(true)} size="sm" className="gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

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

            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
}
