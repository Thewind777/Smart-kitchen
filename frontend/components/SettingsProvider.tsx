"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { createClient } from "@supabase/supabase-js";

type Theme = "cozy" | "old-money" | "tech" | "luxury";
type Persona = "family-first" | "keto-warrior" | "gym-rat" | "old-money" | "budget-hero";

interface SettingsContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    persona: Persona;
    setPersona: (p: Persona) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [theme, setTheme] = useState<Theme>("cozy");
    const [persona, setPersona] = useState<Persona>("family-first");
    const [loaded, setLoaded] = useState(false);

    // Load persona from database when user logs in
    useEffect(() => {
        async function loadUserProfile() {
            if (!user) {
                // Load from localStorage for non-logged-in users
                const savedPersona = localStorage.getItem("rc-persona") as Persona;
                if (savedPersona) setPersona(savedPersona);
                setLoaded(true);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('persona')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setPersona(data.persona as Persona);
                }
            } catch (err) {
                console.error('Failed to load user profile:', err);
            } finally {
                setLoaded(true);
            }
        }

        loadUserProfile();
    }, [user]);

    // Save persona to database when it changes (if logged in)
    useEffect(() => {
        if (!loaded) return; // Don't save on initial load

        async function savePersona() {
            if (user) {
                // Save to database for logged-in users
                await supabase
                    .from('user_profiles')
                    .update({ persona, updated_at: new Date().toISOString() })
                    .eq('id', user.id);
            } else {
                // Save to localStorage for guests
                localStorage.setItem("rc-persona", persona);
            }
        }

        savePersona();
    }, [persona, user, loaded]);

    // Theme is still localStorage-only (can be synced to DB later if needed)
    useEffect(() => {
        const savedTheme = localStorage.getItem("rc-theme") as Theme;
        if (savedTheme) setTheme(savedTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("rc-theme", theme);
    }, [theme]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, persona, setPersona }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
