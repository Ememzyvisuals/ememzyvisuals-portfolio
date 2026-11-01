"use client";
// components/layout/ThemePill.tsx
// System / Light / Dark in one rounded pill; a soft highlight slides to the active choice.
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTS = [
  { v: "system", icon: Monitor, label: "Use system theme" },
  { v: "light", icon: Sun, label: "Light theme" },
  { v: "dark", icon: Moon, label: "Dark theme" },
] as const;

export function ThemePill({ size = "md" }: { size?: "sm" | "md" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cur = mounted ? theme ?? "light" : "light";
  const idx = Math.max(0, OPTS.findIndex((o) => o.v === cur));
  const s = size === "sm" ? 26 : 28;
  return (
    <div role="radiogroup" aria-label="Colour theme" className="relative inline-flex items-center rounded-full border border-border bg-background/60 p-[3px]">
      <span
        aria-hidden
        className="absolute top-[3px] rounded-full bg-foreground/10 ring-1 ring-foreground/15 transition-transform duration-300 ease-out"
        style={{ width: s, height: s, transform: `translateX(${idx * s}px)` }}
      />
      {OPTS.map(({ v, icon: Icon, label }) => (
        <button
          key={v}
          role="radio"
          aria-checked={cur === v}
          aria-label={label}
          title={label}
          onClick={() => setTheme(v)}
          className={cn("relative grid place-items-center rounded-full transition-colors", cur === v ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
          style={{ width: s, height: s }}
        >
          <Icon size={size === "sm" ? 13 : 14} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
