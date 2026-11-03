// components/ui/SectionHeader.tsx
// The one section header used across the site: the title takes the left seven columns on desktop and the
// intro sits in the right four, aligned to the title's baseline, so large type is balanced by text.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  intro,
  action,
  as: Tag = "h2",
  className,
}: {
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <header className={cn("grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8", className)}>
      <Tag className={cn("lg:col-span-7", Tag === "h1" ? "text-h1" : "text-h2")}>{title}</Tag>
      {(intro || action) && (
        <div className="space-y-5 lg:col-span-4 lg:col-start-9 lg:pb-1">
          {intro && <p className="text-lead text-muted-foreground">{intro}</p>}
          {action}
        </div>
      )}
    </header>
  );
}
