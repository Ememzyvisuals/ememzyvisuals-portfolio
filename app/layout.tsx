// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | Emmanuel Ariyo — Ememzyvisuals`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,

  alternates: {
    canonical: siteConfig.url,
    languages: { "en-US": siteConfig.url },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "Ememzyvisuals — Emmanuel Ariyo",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emmanuel Ariyo — Web Developer, AI Engineer & Automation Expert",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@ememzyvisuals",
    creator: "@ememzyvisuals",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/og/og-image.png", alt: "Emmanuel Ariyo — Ememzyvisuals" }],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  category: "technology",
  verification: {
     google:"wv1kiSqlhdc7RJ1foB6FN9IGKHtz7LgJ8Zt4NRHrnGs",
  },
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

// ── 1. PERSON — who Emmanuel is ──────────────────────────────────────────────
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: "Emmanuel Ariyo",
  alternateName: ["Ememzyvisuals", "Ememzyvisuals Digitals"],
  description: "Emmanuel Ariyo (Ememzyvisuals) is a Web Developer, AI Systems Engineer, and Business Automation Expert based in Nigeria. He builds premium websites, full-stack web applications, AI-powered systems, and automation tools for businesses worldwide.",
  url: siteConfig.url,
  image: { "@type": "ImageObject", url: `${siteConfig.url}/og/og-image.png`, width: 1200, height: 630 },
  jobTitle: "Web Developer, AI Engineer & Automation Expert",
  worksFor: { "@type": "Organization", name: "Ememzyvisuals Digitals", url: siteConfig.url },
  address: { "@type": "PostalAddress", addressCountry: "NG", addressRegion: "Nigeria" },
  email: siteConfig.author.email,
  sameAs: [
    siteConfig.socials.github,
    siteConfig.socials.twitter,
    siteConfig.socials.kaggle,
    siteConfig.socials.tiktok,
  ],
  knowsAbout: [
    "Web Development", "Website Design", "Next.js", "React", "TypeScript",
    "Full Stack Development", "SaaS Development", "E-commerce Development",
    "Artificial Intelligence", "AI Systems Engineering", "LLM Engineering",
    "Business Automation", "Telegram Bot Development", "WhatsApp Automation",
    "Workflow Automation", "Python", "Groq API", "PostgreSQL", "Docker",
    "Progressive Web Apps", "API Development", "Software Architecture",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Web Developer & AI Engineer",
    occupationLocation: { "@type": "Country", name: "Nigeria" },
    skills: "Website Development, Web Application Development, AI Systems, Business Automation, Next.js, React, Python, Groq API",
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      currency: "USD",
      unitText: "HOUR",
    },
  },
  owns: [
    { "@type": "SoftwareApplication", name: "ClaudGPT", url: "https://claudgpt.vercel.app", description: "Multi-Agent AI Development Platform" },
    { "@type": "SoftwareApplication", name: "AethLife", url: "https://aethlife.vercel.app", description: "AI-Powered Life Tracking Platform" },
    { "@type": "SoftwareApplication", name: "FlonexTV", url: "https://flonextv.vercel.app", description: "Streaming & Academy Platform" },
    { "@type": "SoftwareApplication", name: "NaijaPrep", url: "https://naijaprep.netlify.app", description: "Exam Preparation PWA" },
    { "@type": "SoftwareApplication", name: "NairaNest", url: "https://nairanest.netlify.app", description: "Fintech Simulation Platform" },
    { "@type": "SoftwareApplication", name: "StoreJet", url: "https://storejet-ng.netlify.app", description: "No-Code Store Builder" },
    { "@type": "SoftwareApplication", name: "Lumeo AI", url: "https://t.me/lumeoai_bot", description: "AI Telegram Bot" },
  ],
};

// ── 2. WEBSITE ───────────────────────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: "Ememzyvisuals — Emmanuel Ariyo",
  alternateName: "Emmanuel Ariyo Portfolio",
  url: siteConfig.url,
  description: siteConfig.description,
  author: { "@id": `${siteConfig.url}/#person` },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/work?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

// ── 3. LOCAL BUSINESS — makes Emmanuel show up in "near me" + service searches ──
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#business`,
  name: "Ememzyvisuals Digitals",
  alternateName: "Emmanuel Ariyo — Web Developer & AI Engineer",
  description: "Premium web development, AI systems engineering, and business automation services. We build websites, web applications, AI-powered products, and automation tools for businesses worldwide.",
  url: siteConfig.url,
  email: siteConfig.author.email,
  founder: { "@id": `${siteConfig.url}/#person` },
  employee: { "@id": `${siteConfig.url}/#person` },
  address: { "@type": "PostalAddress", addressCountry: "NG", addressRegion: "Nigeria" },
  areaServed: ["Worldwide", "Nigeria", "Africa", "United States", "United Kingdom", "Canada"],
  serviceType: [
    "Website Development",
    "Web Application Development",
    "AI System Development",
    "Business Automation",
    "Telegram Bot Development",
    "WhatsApp Bot Development",
    "SaaS Development",
    "API Development",
  ],
  priceRange: "$$",
  sameAs: [siteConfig.socials.github, siteConfig.socials.twitter],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Development Services",
    itemListElement: siteConfig.services.map((s, i) => ({
      "@type": "Offer",
      "@id": `${siteConfig.url}/#service-${i}`,
      name: s.name,
      description: s.description,
      seller: { "@id": `${siteConfig.url}/#person` },
    })),
  },
};

// ── 4. PROFILE PAGE ──────────────────────────────────────────────────────────
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteConfig.url}/#profile`,
  name: "Emmanuel Ariyo — Ememzyvisuals",
  url: siteConfig.url,
  dateCreated: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  about: { "@id": `${siteConfig.url}/#person` },
  mainEntity: { "@id": `${siteConfig.url}/#person` },
};

// ── 5. BREADCRUMB for the home page ─────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    { "@type": "ListItem", position: 2, name: "Work", item: `${siteConfig.url}/work` },
    { "@type": "ListItem", position: 3, name: "Contact", item: `${siteConfig.url}/contact` },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <meta name="author" content="Emmanuel Ariyo" />
        <meta name="copyright" content="Emmanuel Ariyo — Ememzyvisuals" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="NG" />
        <meta name="geo.placename" content="Nigeria" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
