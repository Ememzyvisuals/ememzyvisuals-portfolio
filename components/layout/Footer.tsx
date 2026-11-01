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
        {/* sign-off: heavy condensed type (Anton) in the style of the reference, in black and white */}
        <div style={{ containerType: "inline-size" }} className="relative select-none pt-[12cqw]">
          {/* big sign-off behind, the waving developer cut out in front of it (reference: big type behind a cut-out object) */}
          <div className="relative">
            <p aria-hidden className="pointer-events-none whitespace-nowrap text-center uppercase leading-[0.86] text-foreground/90" style={{ fontFamily: "var(--font-signoff)", fontSize: "21cqw", letterSpacing: "-0.01em" }}>
              Thank you
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer-bow.webp"
              alt="A 3D figure taking a thank-you bow"
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute bottom-0 left-[59%] -translate-x-1/2"
              style={{ height: "31cqw", width: "auto", WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)" }}
            />
          </div>
          <p className="relative mt-3 flex items-center justify-center gap-3 whitespace-nowrap uppercase leading-none" style={{ fontFamily: "var(--font-signoff)", fontSize: "5.4cqw" }}>
            <span className="text-foreground/80">Emmanuel Ariyo</span>
            <span className="text-brand">{year}</span>
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
