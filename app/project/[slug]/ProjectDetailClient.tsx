"use client";
// app/project/[slug]/ProjectDetailClient.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Clock } from "lucide-react";
import type { Project } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  AI_ML: "AI / ML",
  WEB_APP: "Web App",
  AUTOMATION: "Automation",
  BENCHMARK: "Benchmark",
  MOBILE: "Mobile",
  FINTECH: "Fintech",
  EDTECH: "EdTech",
};

interface Props {
  project: Partial<Project>;
}

export function ProjectDetailClient({ project }: Props) {
  const isInDev = project.status === "IN_DEVELOPMENT";

  return (
    <article className="py-16 md:py-24">
      <div className="container-padded max-w-4xl space-y-12">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} />
            Back to Work
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-xs">{CATEGORY_LABELS[project.category ?? "WEB_APP"]}</span>
            {isInDev && (
              <span className="badge-dev">
                <Clock size={11} />
                In Development
              </span>
            )}
            {!isInDev && (
              <span className="badge-done">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Completed
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.subtitle}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                <Github size={14} />
                GitHub
              </a>
            )}
          </div>
        </motion.div>

        {/* Cover image or placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="aspect-[16/9] rounded-2xl overflow-hidden bg-secondary border border-border flex items-center justify-center"
        >
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-2 p-8">
              <p className="text-4xl font-bold text-muted-foreground/20">{project.title}</p>
              <p className="text-sm text-muted-foreground">Screenshot coming soon</p>
            </div>
          )}
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
            {project.longDesc && (
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.longDesc}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tech Stack */}
            <div className="card-surface p-5 space-y-3">
              <h3 className="text-sm font-bold">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack?.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="card-surface p-5 space-y-3">
              <h3 className="text-sm font-bold">Links</h3>
              <div className="space-y-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink size={13} /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={13} /> Source Code
                  </a>
                )}
              </div>
            </div>
          </aside>
        </motion.div>

        {/* Mobile screenshots */}
        {project.mobileImages && project.mobileImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Mobile Views</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {project.mobileImages.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-56 aspect-[9/19] rounded-3xl overflow-hidden border-4 border-foreground/10 shadow-phone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${project.title} mobile view ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Web screenshots */}
        {project.webImages && project.webImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Web Views</h2>
            <div className="space-y-4">
              {project.webImages.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${project.title} web view ${i + 1}`} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
