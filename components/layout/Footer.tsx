// components/layout/Footer.tsx
"use client";
import Link from "next/link";
import { siteConfig } from "@/config/site";

function GithubIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#24292e"/>
      <path d="M18 8.5C12.477 8.5 8 12.977 8 18.5c0 4.42 2.865 8.166 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.528 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0118 13.84a9.6 9.6 0 012.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.308.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C25.138 26.663 28 22.918 28 18.5 28 12.977 23.523 8.5 18 8.5z" fill="white"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#000"/>
      <path d="M19.776 16.895L25.4 10H24.01L19.153 16.01 15.29 10H10.5L16.408 18.884 10.5 26H11.89L17.03 19.765 21.11 26H25.9L19.776 16.895ZM17.726 18.96L17.11 18.058 12.38 11.05H14.61L18.27 16.847L18.886 17.75L24.011 25.002H21.781L17.726 18.96Z" fill="white"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#0A66C2"/>
      <path d="M13.5 14.5H10.5V25.5H13.5V14.5ZM12 13.25C13.1 13.25 14 12.35 14 11.25C14 10.15 13.1 9.25 12 9.25C10.9 9.25 10 10.15 10 11.25C10 12.35 10.9 13.25 12 13.25ZM25.5 25.5H22.5V20.1C22.5 18.9 22.5 17.35 20.85 17.35C19.15 17.35 18.9 18.65 18.9 20V25.5H15.9V14.5H18.75V15.85H18.8C19.2 15.1 20.2 14.3 21.7 14.3C24.75 14.3 25.5 16.3 25.5 18.9V25.5Z" fill="white"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#000"/>
      <path d="M24.5 14.069a5.483 5.483 0 01-3.203-1.024v4.662a4.96 4.96 0 11-4.297-4.906v2.727a2.24 2.24 0 102.24 2.179v-9.207h2.662a3.203 3.203 0 003.598 2.867v2.702z" fill="white"/>
    </svg>
  );
}

function KaggleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#20BEFF"/>
      <path d="M24.825 25.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H11.505c-.236 0-.354-.117-.354-.352V10.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v8.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" fill="white"/>
    </svg>
  );
}

function HuggingFaceIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#FF9D00"/>
      <text x="18" y="25" textAnchor="middle" fontSize="18" fill="white">🤗</text>
    </svg>
  );
}

const SOCIALS = [
  { label: "GitHub",      href: siteConfig.socials.github,   Icon: GithubIcon },
  { label: "LinkedIn",    href: siteConfig.socials.linkedin,  Icon: LinkedInIcon },
  { label: "X",           href: siteConfig.socials.twitter,   Icon: XIcon },
  { label: "TikTok",      href: siteConfig.socials.tiktok,    Icon: TikTokIcon },
  { label: "Kaggle",      href: siteConfig.socials.kaggle,    Icon: KaggleIcon },
  { label: "HuggingFace", href: siteConfig.axiveri.huggingface, Icon: HuggingFaceIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-padded py-16 md:py-20 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight block">
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Self-taught developer & AI engineer building high-quality web apps,
              intelligent tools, and open-source AI models — from Next.js to Groq to Africlaude.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <p className="text-sm font-extrabold text-foreground">Portfolio</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Work",        href: "/work" },
                { label: "Services",    href: "/services" },
                { label: "Automation",  href: "/automation" },
                { label: "Benchmarks",  href: "/benchmarks" },
                { label: "About",       href: "/about" },
                { label: "FAQ",         href: "/faq" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact + Socials */}
          <div className="space-y-4">
            <p className="text-sm font-extrabold text-foreground">Get in Touch</p>
            <a href={`mailto:${siteConfig.author.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              {siteConfig.author.email}
            </a>
            <Link href="/axiveri"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Axiveri — AI Research
            </Link>
            <div className="flex flex-wrap gap-3 pt-1">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} title={label}
                  className="hover:opacity-80 transition-opacity hover:scale-105 transform">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed &amp; built by Emmanuel Ariyo · Founder of{" "}
            <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2">
              Axiveri
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
