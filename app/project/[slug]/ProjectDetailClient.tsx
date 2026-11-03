"use client";
// app/project/[slug]/ProjectDetailClient.tsx

import Link from "next/link";
import { Github, Clock } from "lucide-react";
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
    <article className="pt-12 md:pt-16 pb-section">
      <div className="container-padded max-w-4xl space-y-12">

        {/* Back */}
        <div>
          <Link href="/work" className="inline-flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors font-medium"> Back to Work
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill text-caption">{CATEGORY_LABELS[project.category ?? "WEB_APP"]}</span>
            {isInDev ? (
              <span className="badge-dev"><Clock size={11} /> In Development</span>
            ) : (
              <span className="badge-done"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Completed</span>
            )}
          </div>
          <h1 className="text-h1">{project.title}</h1>
          <p className="text-lead text-muted-foreground">{project.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-small"> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-small">
                <Github size={14} /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Cover image */}
        <div
          className="aspect-[16/9] rounded-2xl overflow-hidden bg-secondary border border-border flex items-center justify-center"
        >
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center space-y-2 p-8">
              <p className="text-h3 font-extrabold text-muted-foreground/20">{project.title}</p>
              <p className="text-small text-muted-foreground">Screenshot coming soon</p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lead font-extrabold mb-3">Overview</h2>
              <p className="text-foreground/80">{project.description}</p>
            </div>
            {project.longDesc && (
              <div className="text-foreground/80 whitespace-pre-line">
                {project.longDesc}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card-surface p-5 space-y-3">
              <h3 className="text-small font-extrabold">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack?.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>

            <div className="card-surface p-5 space-y-3">
              <h3 className="text-small font-extrabold">Links</h3>
              <div className="space-y-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors"> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors">
                    <Github size={13} /> Source Code
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile screenshots */}
        {project.mobileImages && project.mobileImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lead font-extrabold">Mobile Views</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {project.mobileImages.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-56 aspect-[9/19] rounded-3xl overflow-hidden border-4 border-foreground/10 shadow-phone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${project.title} mobile ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Web screenshots */}
        {project.webImages && project.webImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lead font-extrabold">Web Views</h2>
            <div className="space-y-4">
              {project.webImages.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${project.title} web ${i + 1}`} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <Link href="/work" className="btn-outline text-small"> All Work</Link>
        </div>
      </div>
    </article>
  );
}
