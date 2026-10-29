import Link from "next/link";

export function SectionHead({ kicker, title, sub, id }: { kicker: string; title: React.ReactNode; sub?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-10 max-w-3xl sm:mb-14">
      <p className="kicker">{kicker}</p>
      <h2 id={id} className="h-section mt-3">{title}</h2>
      {sub && <p className="mt-5 text-lg text-muted">{sub}</p>}
    </div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Ext({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 font-semibold hover:underline ${className}`}>
      {children}
      <Arrow />
    </a>
  );
}

export function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn-ghost mt-10">
      {children}
      <Arrow />
    </Link>
  );
}

export function Tags({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => (
        <li key={t} className="tag">{t}</li>
      ))}
    </ul>
  );
}
