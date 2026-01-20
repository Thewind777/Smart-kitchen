"use client";

import { Search, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./button";

interface SearchInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    onSearch?: () => void;
}

export function SearchInput({ value, onChange, placeholder = "Search...", onSearch }: SearchInputProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        onChange("");
        inputRef.current?.focus();
    };

    return (
        <div
            className={`relative flex items-center w-full max-w-2xl mx-auto transition-all duration-200 ease-in-out ${focused ? "scale-[1.01]" : "scale-100"
                }`}
        >
            <div
                className={`absolute inset-0 rounded-full transition-shadow duration-200 ${focused ? "shadow-lg ring-2 ring-primary/20" : "shadow-sm"
                    }`}
            />

            <div className="relative flex h-14 w-full items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                <div className="flex h-full items-center justify-center pl-4 pr-2">
                    <Search className={`h-5 w-5 transition-colors ${focused ? "text-primary" : "text-gray-400"}`} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    className="h-full w-full border-none bg-transparent px-2 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                />

                {value && (
                    <button
                        onClick={handleClear}
                        className="mr-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                <div className="pr-1.5">
                    <Button
                        onClick={onSearch}
                        size="sm"
                        className="h-11 rounded-full px-6 text-base font-medium shadow-none hover:shadow-md"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}
