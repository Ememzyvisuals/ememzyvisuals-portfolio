"use client";
// components/layout/Navbar.tsx

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemePill } from "./ThemePill";
import { navItems, primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const mainItems = primaryNav.map((h) => navItems.find((i) => i.href === h) ?? { label: "Games", href: h });

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* the bar: the name on the left and each link as its own thin-outlined pill on the right, floating on the
          page (no box); a soft fade behind it once the page scrolls so the pills stay readable */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background] duration-300",
          scrolled && !mobileOpen ? "bg-gradient-to-b from-background via-background/80 to-transparent" : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between gap-4 px-4 pt-4 lg:container-padded lg:py-6">
          <Link href="/" aria-label="Home" className="sr-only">{siteConfig.name}</Link>

          {/* desktop: the main pages spread evenly across the top, then the menu and the theme on the right */}
          <nav aria-label="Main navigation" className="hidden flex-1 items-center gap-9 lg:flex">
            {[{ label: "Home", href: "/" }, ...mainItems].map((item) => (
              <Link key={item.href} href={item.href} className={cn("nav-link", isActive(item.href) && "nav-link-on")}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-link"
              aria-label={mobileOpen ? "Close the menu" : "Open the menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} strokeWidth={2.2} /> : <Menu size={18} strokeWidth={2.2} />}
              <span>{mobileOpen ? "Close" : "Menu"}</span>
            </button>
            <ThemePill size="sm" />
          </div>

          {/* phones and tablets: the glass bar as before, the name on the left, the theme and the menu on the right */}
          <div className="w-full lg:hidden" role="navigation" aria-label="Main navigation">
            <GlassPanel
              cornerRadius={16}
              displacementScale={40}
              blurAmount={0.1}
              elasticity={0.08}
              className={cn("!flex w-full items-center justify-between px-5 py-3 rounded-xl border border-border transition-shadow duration-300", scrolled && "shadow-card")}
              fallbackClassName={cn("liquid-glass flex w-full items-center justify-between px-5 py-3 rounded-xl border border-border !bg-background/70", scrolled && "shadow-card")}
            >
              <Link href="/" className="text-sm font-bold text-foreground">{siteConfig.name}</Link>
              <div className="flex items-center gap-2">
                <ThemePill size="sm" />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="Toggle menu"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                </button>
              </div>
            </GlassPanel>
          </div>
        </div>
      </header>

      {/* the menu: a panel under the menu button with every page, in two columns; tap outside or Close to shut it */}
      {mobileOpen && (
        <>
          <button aria-label="Close the menu" className="fixed inset-0 z-40 cursor-default bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="menu-panel fixed right-4 top-[72px] z-50 w-[min(92vw,460px)] rounded-2xl border border-border bg-background p-3 shadow-card-hover md:right-[4.4vw]">
            <nav aria-label="All pages" className="grid grid-cols-2 gap-1">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 22}ms` }}
                  className={cn(
                    "menu-rise rounded-xl px-4 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors",
                    isActive(item.href) ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Spacer */}
      {pathname !== "/" && <div className="h-[72px]" />}
    </>
  );
}
