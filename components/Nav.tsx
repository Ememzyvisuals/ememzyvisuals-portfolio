"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { setQuality, useQuality, type Quality } from "@/lib/quality";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function flip() {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    try { localStorage.setItem("ev:theme", d ? "dark" : "light"); } catch {}
    // 3D materials read the theme when they mount, so remount the stage.
    window.dispatchEvent(new Event("ev:theme"));
  }
  return (
    <button onClick={flip} className="grid h-9 w-9 place-items-center rounded-full hover:bg-fg/5" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dark ? <circle cx="12" cy="12" r="4.5" /> : <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />}
        {dark && <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />}
      </svg>
    </button>
  );
}

const labels: Record<Quality, string> = { full: "3D: Full", lite: "3D: Lite", off: "3D: Off" };
export function QualityToggle() {
  const { quality, ready } = useQuality();
  if (!ready) return null;
  const next: Quality = quality === "full" ? "lite" : quality === "lite" ? "off" : "full";
  return (
    <button
      onClick={() => setQuality(next)}
      className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted hover:bg-fg/5 hover:text-fg"
      title="Change how much 3D runs on this device"
    >
      {labels[quality]}
    </button>
  );
}

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 24);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  if (path.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4">
      <nav
        className={`mx-auto flex max-w-page items-center justify-between rounded-2xl px-3 py-2 transition-all sm:px-4 ${scrolled || open ? "glass" : ""}`}
        aria-label="Main"
      >
        <Link href="/" className="font-display text-[15px] font-extrabold tracking-tight" aria-label="Ememzyvisuals home">
          EMEMZYVISUALS
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${active ? "bg-fg text-bg" : "text-fg/75 hover:bg-fg/5 hover:text-fg"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden sm:block"><QualityToggle /></span>
          <ThemeToggle />
          <button
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-fg/5 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-page rounded-2xl p-2 md:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 font-display text-2xl font-bold hover:bg-fg/5">
              {n.label}
            </Link>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-line px-2 pt-2">
            <QualityToggle />
            <Link href="/certificates" className="text-sm font-medium text-muted">Certificates</Link>
          </div>
        </div>
      )}
    </header>
  );
}
