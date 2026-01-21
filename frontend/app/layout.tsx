import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import { AuthProvider } from "@/components/AuthProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruby Cassini - Smart Grocery Savings",
  description: "Save on groceries with AI. Family-first price comparison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <AuthProvider>
          <SettingsProvider>
            <NavBar />
            <div className="md:pt-0 pb-20 md:pb-0">
              {children}
            </div>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
