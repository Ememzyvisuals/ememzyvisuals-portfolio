"use client";
// components/ui/VisitorCounter.tsx
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Only count once per session
    const counted = sessionStorage.getItem("visited");

    if (!counted) {
      fetch("/api/visitors", { method: "POST" })
        .then((r) => r.json())
        .then((d) => { setCount(d.count); sessionStorage.setItem("visited", "1"); })
        .catch(() => {});
    } else {
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((d) => setCount(d.count))
        .catch(() => {});
    }
  }, []);

  if (!count) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground">
      <Users size={11} />
      <span>{count.toLocaleString()} portfolio visits</span>
    </div>
  );
}
