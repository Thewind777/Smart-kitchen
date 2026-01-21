"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function AuthModal({ onClose }: { onClose: () => void }) {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "signin") {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {mode === "signin" ? "Signing in..." : "Creating account..."}
                            </span>
                        ) : (
                            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                        className="text-sm text-primary hover:underline"
                    >
                        {mode === "signin"
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Sign in"}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
