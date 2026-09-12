"use client";
// app/work/WorkClientPage.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ALL_PROJECTS } from "@/data/projects";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All",      value: "all" },
  { label: "AI / ML",  value: "AI_ML" },
  { label: "Web Apps", value: "WEB_APP" },
  { label: "Mobile",   value: "MOBILE" },
  { label: "EdTech",   value: "EDTECH" },
  { label: "Fintech",  value: "FINTECH" },
  { label: "Featured", value: "featured" },
];

export function WorkClientPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "featured"
      ? ALL_PROJECTS.filter((p) => p.featured)
      : activeFilter === "all"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="py-16 md:py-24">
      <div className="container-padded space-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="section-heading">Work.</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            A complete collection of production-grade applications, AI systems,
            and platforms I&apos;ve built. Everything here is shipped and live.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1 p-1.5 rounded-full liquid-glass overflow-x-auto max-w-full no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-150 flex-shrink-0 whitespace-nowrap",
                  activeFilter === f.value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
