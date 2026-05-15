"use client";
// app/work/WorkClientPage.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ALL_PROJECTS } from "@/data/projects";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "AI / ML", value: "AI_ML" },
  { label: "Web Apps", value: "WEB_APP" },
  { label: "EdTech", value: "EDTECH" },
  { label: "Fintech", value: "FINTECH" },
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
      <div className="container-padded space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="section-heading">Work.</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            A complete collection of production-grade applications, AI systems, and
            platforms I&apos;ve built. Everything here is shipped and live.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1.5 bg-secondary rounded-full border border-border flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
                  activeFilter === f.value
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center ml-auto">
            <span className="text-xs text-muted-foreground">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
