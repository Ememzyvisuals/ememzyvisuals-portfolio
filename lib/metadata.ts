// lib/metadata.ts
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogSubtitle?: string;
  ogTag?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedAt?: string;
  tags?: string[];
  serviceSchema?: {
    name: string;
    description: string;
  };
}

export function buildMeta({
  title,
  description,
  path,
  ogTitle,
  ogSubtitle,
  ogTag,
  image,
  type = "website",
  publishedAt,
  tags,
}: PageMetaOptions): Metadata {
  const url = `${siteConfig.url}${path}`;

  const dynamicOgUrl = image
    ? image
    : `${siteConfig.url}/og?title=${encodeURIComponent(
        ogTitle || title
      )}&subtitle=${encodeURIComponent(
        ogSubtitle || siteConfig.description
      )}&tag=${encodeURIComponent(ogTag || "")}`;

  return {
    title,
    description,
    keywords: [
      ...(siteConfig.keywords as string[]),
      ...(tags ?? []),
    ],
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: "Ememzyvisuals — Emmanuel Ariyo",
      title: ogTitle || title,
      description,
      locale: "en_US",
      images: [
        {
          url: dynamicOgUrl,
          width: 1200,
          height: 630,
          alt: `${ogTitle || title} — Emmanuel Ariyo (Ememzyvisuals)`,
          type: "image/png",
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@ememzyvisuals",
      creator: "@ememzyvisuals",
      title: ogTitle || title,
      description,
      images: [{ url: dynamicOgUrl, alt: `${ogTitle || title} — Ememzyvisuals` }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
