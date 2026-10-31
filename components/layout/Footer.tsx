// components/layout/Footer.tsx
"use client";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SocialHang } from "@/components/three/footer/SocialHang";

const HANGING = [
  { label: "GitHub", href: siteConfig.socials.github, color: "#24292e" },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, color: "#0A66C2" },
  { label: "X", href: siteConfig.socials.twitter, color: "#000000" },
  { label: "TikTok", href: siteConfig.socials.tiktok, color: "#000000" },
  { label: "Kaggle", href: siteConfig.socials.kaggle, color: "#20BEFF" },
  { label: "Hugging Face", href: siteConfig.axiveri.huggingface, color: "#FFD21E" },
];


export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <SocialHang items={HANGING} />
      <div className="container-padded pb-6 pt-4 md:pt-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight block">
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Self-taught developer & AI engineer building high-quality web apps,
              intelligent tools, and open-source AI models, from Next.js to Groq to Africlaude.
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
              Axiveri, AI Research
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ containerType: "inline-size" }}>
          <p aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-display font-extrabold leading-[0.8] tracking-[-0.055em] text-foreground"
            style={{ fontSize: "13.4cqw" }}>
            Emmanuel Ariyo
          </p>
        </div>
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
