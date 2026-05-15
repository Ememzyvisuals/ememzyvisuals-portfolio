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
  { label: "All", value: "all" },
  { label: "AI / ML", value: "AI_ML" },
  { label: "Web Apps", value: "WEB_APP" },
  { label: "EdTech", value: "EDTECH" },
  { label: "Fintech", value: "FINTECH" },
];

export function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="py-section">
      <div className="container-padded space-y-12">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-heading">Projects.</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              Production-grade applications and AI systems shipped for real users.
            </p>
          </motion.div>

          <Link href="/work" className="btn-outline self-start md:self-auto text-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter pills — Allwell style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <div className="flex items-center gap-1.5 p-1.5 bg-secondary rounded-full border border-border">
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
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              featured={project.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
