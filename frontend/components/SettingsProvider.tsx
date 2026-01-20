"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "cozy" | "old-money" | "tech" | "luxury";
type Persona = "generic" | "gym-rat" | "mom-saver" | "student";

interface SettingsContextType {
    theme: Theme;
    setTheme: (t: Theme) => void;
    persona: Persona;
    setPersona: (p: Persona) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("cozy");
    const [persona, setPersona] = useState<Persona>("generic");

    // Load from local storage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("rc-theme") as Theme;
        const savedPersona = localStorage.getItem("rc-persona") as Persona;
        if (savedTheme) setTheme(savedTheme);
        if (savedPersona) setPersona(savedPersona);
    }, []);

    // Sync to Body Attribute and Local Storage
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("rc-theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("rc-persona", persona);
    }, [persona]);

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
