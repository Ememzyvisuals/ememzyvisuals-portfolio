import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjectDetailClient } from "./ProjectDetailClient";
import { siteConfig } from "@/config/site";

// 1. Wrap params inside a Promise for Next.js 15
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

// 2. Await params inside your metadata generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
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

// 3. Make the main page component async and await params
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
