"use client";
// components/ui/ProjectCard.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Partial<Project>;
  index?: number;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  AI_ML: "AI / ML",
  WEB_APP: "Web App",
  AUTOMATION: "Automation",
  BENCHMARK: "Benchmark",
  MOBILE: "Mobile",
  FINTECH: "Fintech",
  EDTECH: "EdTech",
};

export function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  const hasBothViews =
    (project.webImages?.length ?? 0) > 0 &&
    (project.mobileImages?.length ?? 0) > 0;
  const isMobilePrimary = project.isMobilePrimary;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group card-surface hover:shadow-card-hover transition-all duration-300",
        featured && "md:col-span-1"
      )}
    >
      {/* ─── Preview area ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[16/10]" : "aspect-[16/9]",
          "bg-secondary flex items-center justify-center"
        )}
      >
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          /* Placeholder — branded empty state */
          <ProjectPlaceholder project={project} />
        )}

        {/* Status badge */}
        {project.status === "IN_DEVELOPMENT" && (
          <div className="absolute top-3 left-3">
            <span className="badge-dev">
              <Clock size={11} />
              In Development
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute top-3 right-3">
          <span className="pill text-xs">
            {CATEGORY_LABELS[project.category ?? "WEB_APP"]}
          </span>
        </div>

        {/* Hover overlay with links */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      {/* ─── Content ─────────────────────────────────────────────────── */}
      <div className="p-5 space-y-3">
        {/* Title + external link */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-foreground leading-tight">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {project.subtitle}
            </p>
          </div>
          <Link
            href={`/project/${project.slug}`}
            className="flex-shrink-0 p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            aria-label={`View ${project.title}`}
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
          {(project.techStack?.length ?? 0) > 4 && (
            <span className="tech-badge">+{(project.techStack?.length ?? 0) - 4}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={12} />
              GitHub
            </a>
          )}
          <Link
            href={`/project/${project.slug}`}
            className="ml-auto text-xs font-semibold text-foreground hover:underline"
          >
            Case Study →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Branded placeholder when no image is uploaded ──────────────────────────

function ProjectPlaceholder({ project }: { project: Partial<Project> }) {
  const colors: Record<string, { bg: string; text: string; dot: string }> = {
    claudgpt: { bg: "#F5EFE6", text: "#8B6B45", dot: "#C8A96A" },
    aethlife: { bg: "#001A14", text: "#00C9A7", dot: "#00C9A7" },
    flonextv: { bg: "#0D0D0D", text: "#E50914", dot: "#E50914" },
    nairanest: { bg: "#F0FDF6", text: "#0D9A6A", dot: "#0D9A6A" },
    storejet: { bg: "#F0FFF8", text: "#059669", dot: "#059669" },
    default: { bg: "#F5F5F5", text: "#888888", dot: "#CCCCCC" },
  };

  const c = colors[project.slug ?? "default"] ?? colors.default;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
      style={{ backgroundColor: c.bg }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
        style={{ backgroundColor: c.dot + "33", color: c.text }}
      >
        {project.title?.[0]}
      </div>
      <p className="text-sm font-bold" style={{ color: c.text }}>
        {project.title}
      </p>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 rounded-full opacity-30"
            style={{ width: i === 2 ? 24 : 16, backgroundColor: c.dot }}
          />
        ))}
      </div>
    </div>
  );
}
