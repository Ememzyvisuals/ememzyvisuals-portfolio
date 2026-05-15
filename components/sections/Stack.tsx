"use client";
// components/sections/Stack.tsx

import { motion } from "framer-motion";
import { STACK_CATEGORIES } from "@/data/stack";
import { cn } from "@/lib/utils";

const levelColor: Record<string, string> = {
  expert: "bg-foreground text-background",
  advanced: "bg-secondary text-foreground border border-border",
  intermediate: "bg-muted text-muted-foreground border border-border",
};

export function Stack() {
  return (
    <section id="stack" className="py-section bg-[hsl(var(--section-alt))]">
      <div className="container-padded space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">My Stack.</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md">
            Technologies I use to build production-grade products and AI systems.
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {STACK_CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: ci * 0.08 }}
              className="card-surface p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="font-bold text-base">{cat.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item.name}
                    className={cn(
                      "text-xs font-medium px-2.5 py-1.5 rounded-lg",
                      levelColor[item.level ?? "advanced"]
                    )}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap">
          <p className="text-xs text-muted-foreground font-medium">Proficiency:</p>
          {[
            { level: "expert", label: "Expert" },
            { level: "advanced", label: "Advanced" },
            { level: "intermediate", label: "Intermediate" },
          ].map(({ level, label }) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className={cn("text-xs px-2 py-0.5 rounded", levelColor[level])}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
