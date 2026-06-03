"use client";
// components/sections/ProjectsGrid.tsx

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ALL_PROJECTS } from "@/data/projects";
import { cn } from "@/lib/utils";

const FILTERS = [
  { label: "All",     value: "all" },
  { label: "Web",     value: "WEB_APP" },
  { label: "AI / ML", value: "AI_ML" },
  { label: "Mobile",  value: "EDTECH" },
];

export function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="py-section">
      <div className="container-padded space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-heading"
          >
            Projects.
          </motion.h2>
          <Link href="/work" className="btn-outline self-start md:self-auto text-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="inline-flex items-center gap-1 p-1.5 bg-secondary rounded-full border border-border">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-150",
                activeFilter === f.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid — single column on mobile, 2-col on desktop */}
        {/* Cards are rounded rectangles so they need gap not margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
