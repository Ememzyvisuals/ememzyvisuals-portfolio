"use client";
// components/sections/Contact.tsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = [
  { value: "software",    label: "Software Development" },
  { value: "partnership", label: "Partnership / Collaboration" },
  { value: "investment",  label: "Investment / Funding Inquiry" },
  { value: "other",       label: "Other" },
];

function generateMath() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b, question: `What is ${a} + ${b}?` };
}

function ContactForm({ defaultCategory }: { defaultCategory: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [category, setCategory] = useState(defaultCategory || "software");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage]   = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [math, setMath]         = useState(generateMath);
  const [botPassed, setBotPassed] = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const checkBot = () => {
    if (parseInt(botAnswer) === math.answer) {
      setBotPassed(true);
    } else {
      setBotPassed(false);
      setMath(generateMath());
      setBotAnswer("");
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)    e.name    = "Name is too short";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (message.trim().length < 10) e.message = "Message is too short";
    if (!botPassed)                e.bot     = "Please complete the verification";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: `[${CATEGORIES.find(c=>c.value===category)?.label}]${whatsapp ? ` | WhatsApp: ${whatsapp}` : ""}\n\n${message}` }),
      });
      if (res.ok) {
        setState("success");
        setName(""); setEmail(""); setWhatsapp(""); setMessage("");
        setBotPassed(false); setBotAnswer(""); setMath(generateMath());
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const inputCls = (field: string) => cn(
    "w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground",
    "outline-none focus:ring-2 focus:ring-ring transition-all",
    errors[field] ? "border-red-400" : "border-border"
  );

  if (state === "success") return (
    <div className="card-surface p-10 flex flex-col items-center justify-center gap-4 text-center">
      <CheckCircle2 size={40} className="text-emerald-500" />
      <div>
        <h3 className="font-extrabold text-lg">Message Sent!</h3>
        <p className="text-muted-foreground text-sm mt-1">Emmanuel will get back to you within 24 hours.</p>
      </div>
      <button onClick={() => setState("idle")} className="btn-outline text-sm">Send Another</button>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">Inquiry Type</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "px-3 py-2.5 rounded-xl border text-xs font-bold text-left transition-all",
                category === c.value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground" htmlFor="name">Name</label>
        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Your name" className={inputCls("name")} />
        {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground" htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com" className={inputCls("email")} />
        {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{errors.email}</p>}
      </div>

      {/* WhatsApp — optional */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground" htmlFor="whatsapp">
          WhatsApp Number <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input id="whatsapp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
          placeholder="+234 800 000 0000"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground" htmlFor="message">
          {category === "investment"  ? "Tell me about your funding interest" :
           category === "partnership" ? "Describe the collaboration" :
           category === "software"    ? "Describe your project or requirements" :
                                        "Your message"}
        </label>
        <textarea id="message" rows={5} value={message} onChange={e => setMessage(e.target.value)}
          placeholder={
            category === "investment"  ? "Funding type, amount range, what you'd like to support..." :
            category === "partnership" ? "Type of partnership, what you're building, how we'd collaborate..." :
            category === "software"    ? "What you need built, timeline, budget range..." :
                                         "Your message..."
          }
          className={cn(inputCls("message"), "resize-none")} />
        {errors.message && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{errors.message}</p>}
      </div>

      {/* Bot check — styled like Cloudflare Turnstile */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">Verification</label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
          <div className="flex-1">
            {botPassed ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/80 flex-shrink-0">{math.question}</span>
                <input
                  type="number"
                  value={botAnswer}
                  onChange={e => setBotAnswer(e.target.value)}
                  onBlur={checkBot}
                  placeholder="Answer"
                  className="w-20 px-3 py-1.5 rounded-lg border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="button" onClick={checkBot}
                  className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity">
                  Check
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-shrink-0">
            <Shield size={10} />
            <span>Protected</span>
          </div>
        </div>
        {errors.bot && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11}/>{errors.bot}</p>}
      </div>

      {state === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Please try again or email directly.</p>
      )}

      <button type="submit" disabled={state === "loading"}
        className={cn("btn-primary w-full justify-center", state === "loading" && "opacity-70 cursor-not-allowed")}>
        {state === "loading" ? "Sending..." : <><Send size={14} /> Send Message</>}
      </button>
    </form>
  );
}

function ContactInner() {
  const params = useSearchParams();
  const defaultCategory = params.get("category") || "software";

  return (
    <section id="contact" className="py-section">
      <div className="container-padded">
        <div className="max-w-xl mx-auto space-y-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="section-heading">Contact.</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Software project, partnership, investment, or collaboration — I&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* CTA card */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-foreground text-background p-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-background/70">Available for new projects</span>
            </div>
            <h3 className="text-2xl font-extrabold">Let&apos;s Work Together</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Open to freelance contracts, full-time roles, partnerships, and investment
              conversations around Axiveri. If you have something in mind, reach out below.
            </p>
            <a href="mailto:contact@ememzyvisuals.com"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-background text-foreground text-sm font-bold hover:opacity-90 transition-opacity">
              contact@ememzyvisuals.com →
            </a>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <ContactForm defaultCategory={defaultCategory} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <Suspense fallback={null}>
      <ContactInner />
    </Suspense>
  );
}
