"use client";
// components/layout/Navbar.tsx

import { useState, useEffect, useRef } from "react";
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
          scrolled ? "bg-gradient-to-b from-background via-background/80 to-transparent" : "bg-transparent"
        )}
      >
        <div className="container-padded flex items-center justify-between gap-4 py-5 md:py-6">
          <Link href="/" aria-label="Home" className="sr-only">{siteConfig.name}</Link>

          {/* desktop: the main pages spread evenly across the top, then the menu and the theme on the right */}
          <nav aria-label="Main navigation" className="hidden flex-1 items-center justify-between pr-14 lg:flex">
            {[{ label: "Home", href: "/" }, ...mainItems].map((item) => (
              <Link key={item.href} href={item.href} className={cn("nav-link", isActive(item.href) && "nav-link-on")}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
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
        </div>
      </header>

      {/* the menu: the whole screen, every page in big type */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-background">
          <nav aria-label="All pages" className="container-padded grid content-center gap-x-10 gap-y-1 pb-10 pt-24 md:min-h-full md:grid-cols-2 lg:grid-cols-3">
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
