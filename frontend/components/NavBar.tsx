"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Calendar, Settings } from "lucide-react";

export function NavBar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Search", href: "/search", icon: Search },
        { name: "Planner", href: "/recipes", icon: Calendar },
        { name: "Cart", href: "/cart", icon: ShoppingBag },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-lg md:hidden">
                <div className="flex justify-between">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isActive ? "bg-primary text-primary-foreground shadow-md" : "text-gray-400 hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-gray-400"}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Top Nav */}
            <nav className="sticky top-0 z-50 hidden border-b border-gray-200 bg-white/80 px-8 py-4 backdrop-blur-md md:block">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white font-bold">
                            R
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight text-gray-900">Ruby Cassini</span>
                    </Link>

                    <div className="flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === item.href ? "text-orange-600" : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-gray-500 hover:text-orange-600">
                            Sign In
                        </button>
                        <button className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
