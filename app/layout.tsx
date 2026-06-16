// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Hardcoded absolute URL — never breaks on any deployment
const OG_IMAGE = "https://ememzyvisuals.vercel.app/og/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://ememzyvisuals.vercel.app"),
  title: { default: siteConfig.title, template: `%s | Emmanuel Ariyo — Ememzyvisuals` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: "https://ememzyvisuals.vercel.app" }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  alternates: { canonical: "https://ememzyvisuals.vercel.app" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ememzyvisuals.vercel.app",
    siteName: "Ememzyvisuals — Emmanuel Ariyo",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Emmanuel Ariyo — Creative Dev & AI Engineer | Ememzyvisuals", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ememzyvisuals",
    creator: "@ememzyvisuals",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  applicationName: siteConfig.name,
  category: "technology",
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://ememzyvisuals.vercel.app/#person",
  name: "Emmanuel Ariyo",
  alternateName: ["Ememzyvisuals", "Ememzyvisuals Digitals"],
  description: siteConfig.description,
  url: "https://ememzyvisuals.vercel.app",
  image: OG_IMAGE,
  jobTitle: "Web Developer, AI Engineer, Automation Expert & Founder of Axiveri",
  worksFor: [
    { "@type": "Organization", name: "Ememzyvisuals Digitals", url: "https://ememzyvisuals.vercel.app" },
    { "@type": "Organization", name: "Axiveri", url: "https://huggingface.co/Axiveri" },
  ],
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  email: siteConfig.author.email,
  sameAs: [
    siteConfig.socials.github,
    siteConfig.socials.twitter,
    siteConfig.socials.kaggle,
    siteConfig.socials.tiktok,
    siteConfig.socials.linkedin,
    "https://huggingface.co/Axiveri",
  ],
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Ememzyvisuals Digitals",
  url: "https://ememzyvisuals.vercel.app",
  email: siteConfig.author.email,
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  areaServed: ["Worldwide", "Nigeria", "Africa"],
  serviceType: ["Website Development", "Web Application Development", "AI Systems", "Business Automation"],
};

const axiveriSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Axiveri",
  url: "https://huggingface.co/Axiveri",
  founder: {
    "@type": "Person",
    name: "Emmanuel Ariyo",
    alternateName: "Ememzyvisuals",
    url: "https://ememzyvisuals.vercel.app",
  },
  description: "Axiveri is an African AI research initiative founded by Emmanuel Ariyo, building open-source language models including the Africlaude series.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can Emmanuel Ariyo build a website for my business?", acceptedAnswer: { "@type": "Answer", text: "Yes. Emmanuel Ariyo builds premium websites, web apps, and platforms worldwide." } },
    { "@type": "Question", name: "Does Emmanuel build AI-powered applications?", acceptedAnswer: { "@type": "Answer", text: "Yes. He builds AI chatbots, multi-agent systems, and AI web apps using Groq API." } },
    { "@type": "Question", name: "What is Ememzyvisuals?", acceptedAnswer: { "@type": "Answer", text: "Ememzyvisuals is Emmanuel Ariyo's brand — a self-taught Creative Software Developer and AI Engineer from Nigeria." } },
    { "@type": "Question", name: "Who is the founder of Axiveri?", acceptedAnswer: { "@type": "Answer", text: "Emmanuel Ariyo (Ememzyvisuals) is the founder of Axiveri, an African AI research initiative building the Africlaude language model series." } },
    { "@type": "Question", name: "What is Africlaude?", acceptedAnswer: { "@type": "Answer", text: "Africlaude is a series of open-source language models developed by Axiveri, founded by Emmanuel Ariyo. Africlaude-7B is the first model in the series, available on HuggingFace at huggingface.co/Axiveri/Africlaude-7B." } },
  ],
};

const FONT_URL = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600,400&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_URL} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(axiveriSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <meta name="author" content="Emmanuel Ariyo" />
        <meta name="geo.region" content="NG" />
      </head>
      <body
        style={{
          fontFamily: '"Cabinet Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
