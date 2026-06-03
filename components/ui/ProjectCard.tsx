"use client";
// components/ui/ProjectCard.tsx
// The ENTIRE card (image + text) is ONE rounded rectangle — exactly Allwell

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface Props {
  project: Partial<Project>;
  index?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  AI_ML: "AI / ML",
  WEB_APP: "Web App",
  AUTOMATION: "Automation",
  BENCHMARK: "Benchmark",
  MOBILE: "Mobile App",
  FINTECH: "Fintech",
  EDTECH: "EdTech",
};

export function ProjectCard({ project, index = 0 }: Props) {
  const isMobile = project.isMobilePrimary;
  const hasCover = !!project.coverImage;
  const isInDev = project.status === "IN_DEVELOPMENT";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.48, delay: index * 0.05 }}
      // ── ONE rounded rectangle wrapping EVERYTHING ──────────────────
      className="group rounded-3xl overflow-hidden border border-border bg-card"
    >
      {/* ── Screenshot image at top of card ─────────────────────── */}
      <div className="relative overflow-hidden bg-[#f0f0f0] dark:bg-zinc-800">

        {/* IN PROGRESS badge — top-left on image */}
        {isInDev && (
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-black text-white uppercase tracking-widest">
              IN PROGRESS
            </span>
          </div>
        )}

        {hasCover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.coverImage!}
            alt={project.title ?? ""}
            className={cn(
              "w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              isMobile
                ? "aspect-[9/16] max-h-[460px] object-top"
                : "aspect-[16/9]"
            )}
          />
        ) : (
          <div className={cn(
            "w-full flex items-center justify-center",
            isMobile ? "aspect-[9/16] max-h-[460px]" : "aspect-[16/9]"
          )}>
            <span
              className="font-black select-none"
              style={{ fontSize: "clamp(5rem, 20vw, 10rem)", color: "rgba(0,0,0,0.06)" }}
            >
              {project.title?.[0]}
            </span>
          </div>
        )}
      </div>

      {/* ── Text content — INSIDE the card rectangle ─────────────── */}
      <div className="px-6 py-6 space-y-3">

        {/* Row 1: category label */}
        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
          {isMobile
            ? <Smartphone size={11} strokeWidth={2.5} />
            : <Globe size={11} strokeWidth={2.5} />
          }
          <span>{CATEGORY_LABELS[project.category ?? "WEB_APP"]}</span>
          <span className="opacity-40">·</span>
          <span>Emmanuel Ariyo</span>
        </div>

        {/* Row 2: title + black circle arrow */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-extrabold text-foreground leading-[1.05]"
            style={{
              fontSize: "clamp(1.7rem, 5vw, 2.3rem)",
              letterSpacing: "-0.035em",
            }}
          >
            {project.title}
          </h3>
          <Link
            href={`/project/${project.slug}`}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mt-0.5 hover:scale-110 active:scale-95 transition-transform duration-200"
            aria-label={`View ${project.title}`}
          >
            <ArrowUpRight size={20} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Row 3: description */}
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {/* Row 4: tech tags — outlined pills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 pb-1">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-border text-muted-foreground uppercase tracking-[0.06em]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
