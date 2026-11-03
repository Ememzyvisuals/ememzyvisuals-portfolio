"use client";
// components/layout/Navbar.tsx
// Desktop: brand, the main pages, a "More" menu for the rest, theme switch and the contact button.
// Phones: brand, theme switch and a menu button that opens every page.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemePill } from "./ThemePill";
import { navItems, primaryNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    if (!moreOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMoreOpen(false); setMobileOpen(false); } };
    const onClick = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onClick); };
  }, [moreOpen, mobileOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));
  const primary = navItems.filter((i) => primaryNav.includes(i.href) && i.href !== "/contact");
  const more = navItems.filter((i) => !primaryNav.includes(i.href) && i.href !== "/contact");
  const moreActive = more.some((i) => isActive(i.href));

  const linkCls = (on: boolean) =>
    cn("rounded-full px-3.5 py-2 text-small font-semibold transition-colors whitespace-nowrap",
      on ? "bg-foreground text-background" : "text-foreground/75 hover:text-foreground hover:bg-foreground/[0.06]");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
        <div className="container-padded">
          <div className={cn("liquid-glass flex h-14 items-center justify-between gap-3 rounded-full pl-5 pr-2 transition-shadow", scrolled && "shadow-card-hover")}>
            <Link href="/" className="font-display font-extrabold text-foreground">
              {siteConfig.name}
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
              {primary.map((item) => (
                <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
              <div ref={moreRef} className="relative">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={linkCls(moreActive || moreOpen)}
                >
                  More
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-border bg-popover p-1.5 shadow-lift">
                    {more.map((item) => (
                      <Link key={item.href} href={item.href}
                        className={cn("block rounded-xl px-3.5 py-2.5 text-small font-semibold", isActive(item.href) ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary hover:text-foreground")}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <ThemePill size="sm" />
              <Link href="/contact" className="hidden h-10 items-center rounded-full bg-brand px-5 text-small font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:inline-flex">
                Contact
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-foreground/[0.06] lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden />
          <nav aria-label="All pages" className="absolute inset-x-4 top-20 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-3xl border border-border bg-popover p-2 shadow-lift sm:inset-x-8">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className={cn("rounded-2xl px-4 py-3 text-small font-semibold", isActive(item.href) ? "bg-foreground text-background" : "text-foreground hover:bg-secondary")}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      {pathname !== "/" && <div className="h-[76px] sm:h-20" aria-hidden />}
    </>
  );
}
