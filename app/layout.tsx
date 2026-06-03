// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | Emmanuel Ariyo — Ememzyvisuals` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website", locale: "en_US", url: siteConfig.url,
    siteName: "Ememzyvisuals — Emmanuel Ariyo",
    title: siteConfig.title, description: siteConfig.description,
    images: [{ url: "/og/og-image.png", width: 1200, height: 630, alt: "Emmanuel Ariyo — Ememzyvisuals" }],
  },
  twitter: {
    card: "summary_large_image", site: "@ememzyvisuals", creator: "@ememzyvisuals",
    title: siteConfig.title, description: siteConfig.description,
    images: ["/og/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: [{ url: "/favicon.icon", sizes: "any" }], apple: "/apple-touch-icon.png" },
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
  width: "device-width", initialScale: 1, maximumScale: 5,
};

const personSchema = {
  "@context": "https://schema.org", "@type": "Person", "@id": `${siteConfig.url}/#person`,
  name: "Emmanuel Ariyo", alternateName: ["Ememzyvisuals", "Ememzyvisuals Digitals"],
  description: siteConfig.description, url: siteConfig.url,
  jobTitle: "Web Developer, AI Engineer & Automation Expert",
  worksFor: { "@type": "Organization", name: "Ememzyvisuals Digitals", url: siteConfig.url },
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  email: siteConfig.author.email,
  sameAs: [siteConfig.socials.github, siteConfig.socials.twitter, siteConfig.socials.kaggle, siteConfig.socials.tiktok],
};

const businessSchema = {
  "@context": "https://schema.org", "@type": "ProfessionalService",
  name: "Ememzyvisuals Digitals", url: siteConfig.url, email: siteConfig.author.email,
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  areaServed: ["Worldwide", "Nigeria", "Africa"],
  serviceType: ["Website Development", "Web Application Development", "AI Systems", "Business Automation"],
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can Emmanuel Ariyo build a website for my business?", acceptedAnswer: { "@type": "Answer", text: "Yes. Emmanuel Ariyo builds premium websites, web apps, and platforms worldwide." } },
    { "@type": "Question", name: "Does Emmanuel build AI-powered applications?", acceptedAnswer: { "@type": "Answer", text: "Yes. He builds AI chatbots, multi-agent systems, and AI web apps using Groq API." } },
    { "@type": "Question", name: "What is Ememzyvisuals?", acceptedAnswer: { "@type": "Answer", text: "Ememzyvisuals is Emmanuel Ariyo's brand — a Creative Software Developer and AI Engineer in Nigeria." } },
  ],
};

// Cabinet Grotesk fallback - preload hint for faster font loading
const FONT_PRELOAD = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600,400&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Cabinet Grotesk for instant rendering */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_PRELOAD} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
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
