// app/project/[slug]/page.tsx
// Next.js 14 — params are NOT a Promise (that's Next.js 15 only)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjectDetailClient } from "./ProjectDetailClient";
import { siteConfig } from "@/config/site";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return ALL_PROJECTS.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = ALL_PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return {};

  return {
    title: `${project.title} | ${siteConfig.name}`,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description ?? "",
      url: `${siteConfig.url}/project/${project.slug}`,
      type: "article",
      images: project.coverImage
        ? [{ url: project.coverImage, width: 1200, height: 630 }]
        : [{ url: `${siteConfig.url}/og/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description ?? "",
    },
    alternates: { canonical: `${siteConfig.url}/project/${project.slug}` },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = ALL_PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
