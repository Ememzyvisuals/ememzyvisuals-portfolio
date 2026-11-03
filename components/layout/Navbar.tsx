"use client";
// components/layout/Navbar.tsx

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MoreHorizontal } from "lucide-react";
import { ThemePill } from "./ThemePill";
import { useTheme } from "next-themes";
import { navItems, primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";

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

  // desktop: the main links stay in the bar, the rest open from the "More" button
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLElement>(null);
  const mainItems = primaryNav.map((h) => navItems.find((i) => i.href === h) ?? { label: "Games", href: h });
  const moreItems = navItems.filter((i) => !primaryNav.includes(i.href) && !(i.href === "/games" && primaryNav.includes("/#games")));
  useEffect(() => {
    if (!moreOpen) return;
    const close = (e: MouseEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMoreOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [moreOpen]);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── DESKTOP NAV ──────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          aria-label="Main navigation"
          className="relative hidden md:flex"
          ref={moreRef}
        >
        <GlassPanel
          cornerRadius={16}
          displacementScale={40}
          blurAmount={0.1}
          elasticity={0.08}
          className={cn(
            "!flex items-center gap-0.5 px-1.5 py-1.5 rounded-xl border border-border",
            "transition-shadow duration-300",
            scrolled && "shadow-card"
          )}
          fallbackClassName={cn(
            "liquid-glass !flex items-center gap-0.5 px-1.5 py-1.5 rounded-xl border border-border !bg-background/70",
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

          {mainItems.map((item) => (
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

          {/* the remaining pages */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-label="More pages"
              className={cn(
                "flex h-8 w-9 items-center justify-center rounded-lg transition-colors",
                moreOpen || moreItems.some((i) => isActive(i.href))
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Theme toggle */}
          <span className="ml-2"><ThemePill /></span>
        </GlassPanel>
          {moreOpen && (
              <div role="menu" className="absolute right-16 top-[calc(100%+10px)] z-50 w-56 rounded-xl border border-border bg-background p-1.5 shadow-card-hover">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
        </nav>

        {/* ─── MOBILE HEADER ───────────────────────────────────────── */}
        <div className="md:hidden w-full" role="navigation" aria-label="Main navigation">
          <GlassPanel
            cornerRadius={16}
            displacementScale={40}
            blurAmount={0.1}
            elasticity={0.08}
            className={cn(
              "!flex w-full items-center justify-between px-5 py-3 rounded-xl border border-border",
              "transition-shadow duration-300",
              scrolled && "shadow-card"
            )}
            fallbackClassName={cn(
              "liquid-glass flex w-full items-center justify-between px-5 py-3 rounded-xl border border-border !bg-background/70",
              scrolled && "shadow-card"
            )}
          >
            <Link href="/" className="text-sm font-bold text-foreground">
              {siteConfig.name}
            </Link>

            <div className="flex items-center gap-2">
              <ThemePill size="sm" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </GlassPanel>
        </div>
      </header>

      {/* ─── MOBILE MENU DRAWER ───────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm liquid-glass"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 liquid-glass rounded-xl shadow-card-hover overflow-hidden">
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
      {pathname !== "/" && <div className="h-[72px]" />}
    </>
  );
}
