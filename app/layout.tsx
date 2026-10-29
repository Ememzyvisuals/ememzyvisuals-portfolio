import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { profile, socials } from "@/content/site";
import Shell from "@/components/Shell";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = localFont({ src: "./fonts/bricolage.woff2", variable: "--font-display", weight: "200 800", display: "swap" });
const body = localFont({ src: "./fonts/outfit.woff2", variable: "--font-body", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: `${profile.name} | ML Engineer and Creative Developer`, template: `%s | ${profile.name}` },
  description: profile.short,
  applicationName: "Ememzyvisuals",
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  alternates: { canonical: "/", types: { "text/plain": "/llms.txt" } },
  openGraph: {
    type: "website",
    siteName: "Ememzyvisuals",
    title: `${profile.name} | ML Engineer and Creative Developer`,
    description: profile.short,
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image", creator: "@ememzyvisuals", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const themeScript = `try{var h=document.documentElement;var t=localStorage.getItem('ev:theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;h.classList.toggle('dark',d);if(!/bot|crawl|spider|slurp|lighthouse|headlesschrome-agent/i.test(navigator.userAgent)&&location.pathname.indexOf('/admin')!==0&&location.pathname.indexOf('/light')!==0)h.classList.add('is-loading')}catch(e){}`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.handle,
  jobTitle: profile.title,
  worksFor: { "@type": "Organization", name: "PlotWeaver" },
  founder: { "@type": "Organization", name: "Axiveri", url: "https://huggingface.co/Axiveri" },
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  email: `mailto:${profile.email}`,
  url: profile.url,
  image: `${profile.url}${profile.photo}`,
  sameAs: socials.map((s) => s.href),
  knowsAbout: ["Speech AI", "Text to speech", "Automatic speech recognition", "Nigerian languages", "Machine learning", "Web development", "three.js"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full site as plain text for AI agents" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn-solid">
          Skip to content
        </a>
        <Shell>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
