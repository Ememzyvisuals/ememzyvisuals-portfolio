"use client";
// components/layout/Navbar.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { navItems, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── DESKTOP NAV ──────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={cn(
            "hidden md:flex items-center gap-0.5 px-1.5 py-1.5 rounded-xl border border-border",
            "bg-background/85 backdrop-blur-xl transition-shadow duration-300",
            scrolled && "shadow-card"
          )}
        >
          {/* Brand */}
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-foreground hover:bg-secondary transition-colors mr-1"
          >
            {siteConfig.name}
          </Link>

          <div className="w-px h-4 bg-border mx-1" />

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap",
                isActive(item.href)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}
        </nav>

        {/* ─── MOBILE HEADER ───────────────────────────────────────── */}
        <div className="md:hidden w-full">
          <div
            className={cn(
              "flex w-full items-center justify-between px-5 py-3 rounded-xl border border-border",
              "bg-background/85 backdrop-blur-xl transition-shadow duration-300",
              scrolled && "shadow-card"
            )}
          >
            <Link href="/" className="text-sm font-bold text-foreground">
              {siteConfig.name}
            </Link>

            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE MENU DRAWER ───────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-background border border-border rounded-xl shadow-card-hover overflow-hidden">
            <nav className="p-2 grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-center",
                    isActive(item.href)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  );
}
