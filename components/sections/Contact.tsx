"use client";
// components/sections/Contact.tsx
// Contact details and profiles on the left, the message form on the right (stacked on phones).
// The form posts to /api/contact (Resend). Fields are checked on blur and on send; errors sit under each field.

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig, socialLinks } from "@/config/site";

const CATEGORIES = [
  { value: "software", label: "Software project", prompt: "What do you need built? Timeline and budget range help." },
  { value: "partnership", label: "Partnership", prompt: "What are you building, and how would we work together?" },
  { value: "investment", label: "Investment", prompt: "Funding type, amount range and what you would like to support." },
  { value: "other", label: "Something else", prompt: "Your message" },
] as const;
type Category = (typeof CATEGORIES)[number]["value"];

const MAX_MESSAGE = 1800;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; whatsapp: string; message: string; answer: string };
type Errors = Partial<Record<keyof Fields, string>>;

function newSum() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 1;
  return { a, b };
}

function check(f: Fields, sum: { a: number; b: number }): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter your name (at least 2 characters).";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (f.whatsapp.trim() && !/^\+?[\d\s()-]{7,20}$/.test(f.whatsapp.trim())) e.whatsapp = "Use digits only, with the country code, like +234 800 000 0000.";
  if (f.message.trim().length < 10) e.message = "Write at least 10 characters so I know what you need.";
  if (f.message.length > MAX_MESSAGE) e.message = `Keep the message under ${MAX_MESSAGE} characters.`;
  if (!f.answer.trim()) e.answer = "Enter the answer to the sum.";
  else if (parseInt(f.answer, 10) !== sum.a + sum.b) e.answer = "That answer is not right. Try the sum again.";
  return e;
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-small font-semibold text-foreground">
        {label}
        {hint && <span className="text-caption font-medium text-muted-foreground">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-caption font-semibold text-danger">
          <AlertCircle size={14} className="mt-px flex-shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const uid = useId();
  const [category, setCategory] = useState<Category>("software");
  const [f, setF] = useState<Fields>({ name: "", email: "", whatsapp: "", message: "", answer: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [failReason, setFailReason] = useState("");
  // same sum on the server and the first client render, a new one after mount (no hydration mismatch)
  const [sum, setSum] = useState({ a: 3, b: 4 });
  const trap = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setSum(newSum());
    try {
      const c = new URLSearchParams(window.location.search).get("category");
      if (c && CATEGORIES.some((x) => x.value === c)) setCategory(c as Category);
    } catch {}
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    if (touched[k]) setErrors((old) => ({ ...old, [k]: check(next, sum)[k] }));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((old) => ({ ...old, [k]: check(f, sum)[k] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = check(f, sum);
    setErrors(errs);
    setTouched({ name: true, email: true, whatsapp: true, message: true, answer: true });
    const first = (Object.keys(errs) as (keyof Fields)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-${first}`)}`)?.focus();
      return;
    }
    setStatus("sending");
    setFailReason("");
    try {
      const label = CATEGORIES.find((c) => c.value === category)?.label;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim(),
          company: trap.current?.value ?? "",
          message: `[${label}]${f.whatsapp.trim() ? ` | WhatsApp: ${f.whatsapp.trim()}` : ""}\n\n${f.message.trim()}`,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setF({ name: "", email: "", whatsapp: "", message: "", answer: "" });
        setTouched({});
        setErrors({});
        setSum(newSum());
      } else {
        const data = await res.json().catch(() => ({}));
        setFailReason(res.status === 400 ? "Some details were not accepted. Check the fields and send again." : data?.error === "not_configured" ? "The message service is not set up yet." : "The server could not send your message.");
        setStatus("failed");
      }
    } catch {
      setFailReason("Your connection dropped before the message was sent.");
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-[520px] flex-col items-start justify-center gap-5 rounded-3xl border border-border bg-card p-8 md:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <div>
          <h3>Message sent</h3>
          <p className="mt-2 max-w-md text-body text-muted-foreground">
            Thank you. I read every message myself and reply within a day, usually sooner.
          </p>
        </div>
        <button type="button" onClick={() => setStatus("idle")} className="btn-outline">Write another message</button>
      </div>
    );
  }

  const id = (k: string) => `${uid}-${k}`;
  const aria = (k: keyof Fields) => ({
    id: id(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-error` : undefined,
    onBlur: blur(k),
  });
  const prompt = CATEGORIES.find((c) => c.value === category)!.prompt;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:p-10">
      <fieldset>
        <legend className="text-small font-semibold text-foreground">What is it about?</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={cn(
                "flex h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-center text-caption font-semibold transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                category === c.value ? "border-brand bg-brand text-brand-foreground" : "border-input text-foreground hover:border-foreground/50",
              )}
            >
              <input type="radio" name="category" value={c.value} checked={category === c.value} onChange={() => setCategory(c.value)} className="sr-only" />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={id("name")} label="Name" error={errors.name}>
          <input {...aria("name")} type="text" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Your name" className="field" />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email}>
          <input {...aria("email")} type="email" autoComplete="email" inputMode="email" value={f.email} onChange={set("email")} placeholder="name@example.com" className="field" />
        </Field>
      </div>

      <Field id={id("whatsapp")} label="WhatsApp number" hint="Optional" error={errors.whatsapp}>
        <input {...aria("whatsapp")} type="tel" autoComplete="tel" value={f.whatsapp} onChange={set("whatsapp")} placeholder="+234 800 000 0000" className="field" />
      </Field>

      <Field id={id("message")} label="Message" hint={`${f.message.length} / ${MAX_MESSAGE}`} error={errors.message}>
        <textarea {...aria("message")} rows={6} value={f.message} onChange={set("message")} placeholder={prompt} className="field resize-y min-h-[160px]" />
      </Field>

      <Field id={id("answer")} label={`Quick check: what is ${sum.a} + ${sum.b}?`} error={errors.answer}>
        <input {...aria("answer")} type="text" inputMode="numeric" autoComplete="off" value={f.answer} onChange={set("answer")} placeholder="Your answer" className="field max-w-[12rem]" />
      </Field>

      {/* left empty by people, filled in by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Company<input ref={trap} type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {status === "failed" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/5 p-4 text-small text-foreground">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-danger" aria-hidden />
          <p>
            <span className="font-semibold">Message not sent.</span> {failReason} Try again, or email me at{" "}
            <a className="link-quiet" href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-caption text-muted-foreground">I reply within a day. Your details are only used to answer you.</p>
        <button type="submit" disabled={status === "sending"} className="btn-primary sm:min-w-[11rem]">
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

export function ContactSection({ page = false }: { page?: boolean }) {
  const Title = page ? "h1" : "h2";
  return (
    <section id="contact" className={cn("tone-blue", page ? "pb-section pt-28 md:pt-32" : "py-section")}>
      <div className="container-padded grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Title className="section-heading">Contact</Title>
          <p className="mt-5 max-w-md text-lead text-muted-foreground">
            A software project, a partnership, an investment conversation around Axiveri, or a role. Tell me what you have in mind.
          </p>

          <a href={`mailto:${siteConfig.author.email}`} className="group mt-9 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/40">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground"><Mail size={20} aria-hidden /></span>
            <span className="min-w-0">
              <span className="block text-caption font-semibold text-muted-foreground">Email me directly</span>
              <span className="block truncate text-body font-semibold text-foreground group-hover:underline group-hover:underline-offset-4">{siteConfig.author.email}</span>
            </span>
          </a>

          <dl className="mt-9 grid grid-cols-2 gap-6 border-t border-border pt-6">
            <div>
              <dt className="text-caption font-semibold text-muted-foreground">Based in</dt>
              <dd className="mt-1 text-small font-semibold text-foreground">Nigeria, working worldwide</dd>
            </div>
            <div>
              <dt className="text-caption font-semibold text-muted-foreground">Open to</dt>
              <dd className="mt-1 text-small font-semibold text-foreground">Freelance, full-time, partnerships</dd>
            </div>
          </dl>

          <div className="mt-9 border-t border-border pt-6">
            <p className="text-caption font-semibold text-muted-foreground">Find me online</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex flex-col py-2 hover:[&_span:first-child]:underline">
                    <span className="text-small font-semibold text-foreground underline-offset-4">{s.label}</span>
                    <span className="text-caption text-muted-foreground">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
