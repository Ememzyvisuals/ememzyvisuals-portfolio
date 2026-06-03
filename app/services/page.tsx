// app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = buildMeta({
  title:
    "Web Development, AI Systems & Business Automation Services | Ememzyvisuals",
  description:
    "Emmanuel Ariyo (Ememzyvisuals) offers premium website development, web application development, AI systems engineering, and business automation services. High-quality. Fast delivery. Real results.",
  path: "/services",
  ogTitle: "Services by Emmanuel Ariyo",
  ogSubtitle:
    "Websites · Web Apps · AI Systems · Business Automation",
  ogTag: "Services",
  tags: [
    "web developer for hire Nigeria",
    "hire website developer",
    "AI developer services",
    "business automation services Nigeria",
    "website development services",
    "web application development services",
    "Telegram bot development service",
    "WhatsApp bot developer for hire",
    "build website Nigeria",
    "high quality website developer",
    "good website developer Nigeria",
    "premium website developer",
  ],
});

// Service-specific JSON-LD — Google shows these as rich results
const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Development Services by Emmanuel Ariyo",
  description:
    "Web development, AI systems, and business automation services",
  url: `${siteConfig.url}/services`,
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Website Development",
        description:
          "Premium, modern websites built with Next.js, React, and Tailwind CSS. Fast, responsive, mobile-first, and SEO-optimized. Perfect for businesses, startups, and personal brands.",
        provider: { "@type": "Person", name: "Emmanuel Ariyo", url: siteConfig.url },
        areaServed: "Worldwide",
        serviceType: "Website Development",
        url: `${siteConfig.url}/services#website`,
        offers: {
          "@type": "Offer",
          description: "Custom website development",
          seller: { "@type": "Person", name: "Emmanuel Ariyo" },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Web Application Development",
        description:
          "Full-stack SaaS platforms, dashboards, and web applications with authentication, real-time features, and databases. Built to scale.",
        provider: { "@type": "Person", name: "Emmanuel Ariyo", url: siteConfig.url },
        areaServed: "Worldwide",
        serviceType: "Web Application Development",
        url: `${siteConfig.url}/services#webapp`,
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "AI System Development",
        description:
          "AI-powered applications using Groq, LLaMA, RAG pipelines, and multi-agent systems. Chatbots, recommendation engines, and AI-native products.",
        provider: { "@type": "Person", name: "Emmanuel Ariyo", url: siteConfig.url },
        areaServed: "Worldwide",
        serviceType: "Artificial Intelligence Development",
        url: `${siteConfig.url}/services#ai`,
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Business Automation",
        description:
          "Telegram bots, WhatsApp automation, workflow automation, and AI agents that automate your business operations and save you hours every week.",
        provider: { "@type": "Person", name: "Emmanuel Ariyo", url: siteConfig.url },
        areaServed: "Worldwide",
        serviceType: "Business Automation",
        url: `${siteConfig.url}/services#automation`,
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Service",
        name: "API & Backend Development",
        description:
          "Scalable REST APIs, database design, and backend systems built with Node.js, PostgreSQL, and Supabase.",
        provider: { "@type": "Person", name: "Emmanuel Ariyo", url: siteConfig.url },
        areaServed: "Worldwide",
        serviceType: "API Development",
        url: `${siteConfig.url}/services#api`,
      },
    },
  ],
};

// FAQ Schema — Google shows this as a rich snippet with expanded answers
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to hire Emmanuel Ariyo for a website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the scope and complexity of your project. Emmanuel Ariyo (Ememzyvisuals) works with startups, small businesses, and enterprise clients. Contact him at contact@ememzyvisuals.com or through the contact page to discuss your project and get a quote.",
      },
    },
    {
      "@type": "Question",
      name: "Can Emmanuel Ariyo build a website for my business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Emmanuel Ariyo builds premium business websites, landing pages, e-commerce stores, and full web applications using Next.js, React, and Tailwind CSS. He is available for freelance work worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Does Emmanuel Ariyo build AI-powered applications?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Emmanuel Ariyo specializes in AI systems engineering. He builds AI chatbots, multi-agent systems, RAG pipelines, LLM integrations using Groq API, and AI-powered web applications.",
      },
    },
    {
      "@type": "Question",
      name: "Can Emmanuel Ariyo automate my business processes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Emmanuel builds Telegram bots, WhatsApp automation bots, workflow automation systems, and AI agents that automate repetitive business tasks. His Lumeo AI Telegram bot and Microdragon CLI agent are live examples of his automation work.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take Emmanuel to deliver a website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Delivery time depends on project complexity. A landing page can be delivered in 3-7 days. A full web application typically takes 2-6 weeks. Emmanuel provides clear timelines upfront for every project.",
      },
    },
    {
      "@type": "Question",
      name: "Is Emmanuel Ariyo available for remote work outside Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Emmanuel Ariyo (Ememzyvisuals) is available for remote freelance contracts, full-time remote roles, and collaborations with clients and companies worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "What is Ememzyvisuals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ememzyvisuals is the professional brand of Emmanuel Ariyo — a Creative Software Developer and AI Systems Engineer based in Nigeria. He builds websites, web applications, AI systems, and business automation tools. His notable projects include ClaudGPT, AethLife, FlonexTV, NaijaPrep, Lumeo AI, Microdragon, and the TruthGuard LLM benchmark.",
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesClient />
    </>
  );
}
