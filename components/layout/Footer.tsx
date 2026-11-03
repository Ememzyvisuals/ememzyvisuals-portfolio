// components/layout/Footer.tsx
import Link from "next/link";
import { siteConfig, socialLinks } from "@/config/site";

const PAGES = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Axiveri", href: "/axiveri" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];
const MORE = [
  { label: "Automation", href: "/automation" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Certificates", href: "/certificates" },
  { label: "Games", href: "/games" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Ask about me", href: "/ask-about-me" },
  { label: "FAQ", href: "/faq" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const linkCls = "text-small text-muted-foreground transition-colors hover:text-foreground";

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-padded pt-section-sm">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="font-display text-h4 text-foreground">{siteConfig.name}</Link>
            <p className="mt-3 max-w-sm text-small text-muted-foreground">
              Emmanuel Ariyo. Machine learning engineer and full-stack developer from Nigeria, building speech and
              language AI for African languages.
            </p>
            <a href={`mailto:${siteConfig.author.email}`} className="link-quiet mt-5 inline-block text-small">{siteConfig.author.email}</a>
          </div>

          <nav aria-label="Pages" className="lg:col-span-2 lg:col-start-6">
            <p className="text-caption font-semibold text-foreground">Pages</p>
            <ul className="mt-4 space-y-2.5">
              {PAGES.map((l) => <li key={l.href}><Link href={l.href} className={linkCls}>{l.label}</Link></li>)}
            </ul>
          </nav>

          <nav aria-label="More pages" className="lg:col-span-2">
            <p className="text-caption font-semibold text-foreground">More</p>
            <ul className="mt-4 space-y-2.5">
              {MORE.map((l) => <li key={l.href}><Link href={l.href} className={linkCls}>{l.label}</Link></li>)}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-caption font-semibold text-foreground">Profiles</p>
            <ul className="mt-4 space-y-2.5">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {s.label} <span className="text-muted-foreground/70">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* sign-off: the wordmark set to the full width of the page */}
        <div style={{ containerType: "inline-size" }} className="mt-section-sm select-none" aria-hidden>
          <p className="font-display font-extrabold text-foreground" style={{ fontSize: "13.9cqw", letterSpacing: "-0.055em", lineHeight: 0.8 }}>
            Ememzyvisuals<span className="text-sun">.</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border py-6 text-caption text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {siteConfig.fullName}. All rights reserved.</p>
          <p>Designed and built by Emmanuel Ariyo, founder of Axiveri.</p>
        </div>
      </div>
    </footer>
  );
}
