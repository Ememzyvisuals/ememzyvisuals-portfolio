// components/layout/Footer.tsx
import Link from "next/link";
import { siteConfig } from "@/config/site";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.28 8.28 0 0 0 4.84 1.55V6.85a4.85 4.85 0 0 1-1.07-.16z" />
    </svg>
  );
}

function KaggleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Work", href: "/work" },
    { label: "Automation", href: "/automation" },
    { label: "Benchmarks", href: "/benchmarks" },
    { label: "Blogs", href: "/blogs" },
    { label: "Ask About Me", href: "/ask-about-me" },
    { label: "Contact", href: "/contact" },
  ];

  const socials = [
    { label: "GitHub", href: siteConfig.socials.github, icon: <GithubIcon /> },
    { label: "X / Twitter", href: siteConfig.socials.twitter, icon: <XIcon /> },
    { label: "TikTok", href: siteConfig.socials.tiktok, icon: <TikTokIcon /> },
    { label: "Kaggle", href: siteConfig.socials.kaggle, icon: <KaggleIcon /> },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-padded py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="text-xl font-bold tracking-tight block">
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Creative Software Developer &amp; AI Systems Engineer building scalable
              systems and intelligent tools that solve real problems.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for new projects
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground">Quick Links</p>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground">Get in Touch</p>
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
            >
              {siteConfig.author.email}
            </a>

            {/* Social icons — Allwell-style icon boxes */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-border bg-secondary hover:bg-accent hover:border-foreground/20 text-muted-foreground hover:text-foreground transition-all duration-200 aspect-square"
                >
                  {s.icon}
                  <span className="text-[9px] font-semibold tracking-tight leading-none">{s.label.split(" ")[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed &amp; built by Emmanuel Ariyo
          </p>
        </div>
      </div>
    </footer>
  );
}
