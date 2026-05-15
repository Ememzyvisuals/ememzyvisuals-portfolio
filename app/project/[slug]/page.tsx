// app/project/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjectDetailClient } from "./ProjectDetailClient";
import { siteConfig } from "@/config/site";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = ALL_PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description,
      url: `${siteConfig.url}/project/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
    alternates: { canonical: `${siteConfig.url}/project/${project.slug}` },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = ALL_PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
