"use client";
// components/layout/Navbar.tsx

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MoreHorizontal } from "lucide-react";
import { ThemePill } from "./ThemePill";
import { navItems, primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* the bar: the name on the left and each link as its own thin-outlined pill on the right, floating on the
          page (no box); a soft fade behind it once the page scrolls so the pills stay readable */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background] duration-300",
          scrolled ? "bg-gradient-to-b from-background via-background/80 to-transparent" : "bg-transparent"
        )}
      >
        <div className="container-padded flex items-center justify-between gap-4 py-4 md:py-5">
          <Link href="/" className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-foreground">
            {siteConfig.name}
          </Link>

          {/* desktop */}
          <nav aria-label="Main navigation" ref={moreRef} className="relative hidden items-center gap-9 lg:flex">
            {mainItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", isActive(item.href) && "nav-link-on")}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-label="More pages"
              className={cn("nav-link", (moreOpen || moreItems.some((i) => isActive(i.href))) && "nav-link-on")}
            >
              <MoreHorizontal size={16} />
            </button>
            <span className="ml-2"><ThemePill /></span>
            {moreOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-2xl border border-border bg-background p-1.5 shadow-card-hover">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm font-bold transition-colors",
                      isActive(item.href) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* phones and tablets */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemePill size="sm" />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-link"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              <span>{mobileOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* the menu on phones: the whole screen, big links */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <nav aria-label="Main navigation" className="container-padded flex h-full flex-col justify-center gap-1 pb-10 pt-24">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${i * 30}ms` }}
                className={cn(
                  "menu-rise font-anton uppercase leading-[1.05] transition-colors",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span style={{ fontSize: "clamp(2rem, 9vw, 3.2rem)" }}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Spacer */}
      {pathname !== "/" && <div className="h-[72px]" />}
    </>
  );
}
