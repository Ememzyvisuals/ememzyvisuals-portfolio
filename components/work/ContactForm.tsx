"use client";
import { useState } from "react";
import { profile } from "@/content/site";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setErr("");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong.");
      setState("sent");
      form.reset();
    } catch (x) {
      setState("error");
      setErr((x as Error).message);
    }
  }

  if (state === "sent")
    return (
      <div className="glass grid place-items-center rounded-xl3 p-10 text-center">
        <div>
          <p className="font-display text-4xl font-extrabold">Message sent.</p>
          <p className="mt-3 text-fg/75">Thanks. I will get back to you by email.</p>
          <button onClick={() => setState("idle")} className="btn-ghost mt-6">Send another</button>
        </div>
      </div>
    );

  const field = "mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-base outline-none transition focus:border-fg";
  return (
    <form onSubmit={submit} className="glass rounded-xl3 p-6 sm:p-8" noValidate={false}>
      <label className="block text-sm font-semibold">
        Your name
        <input name="name" required maxLength={120} autoComplete="name" className={field} />
      </label>
      <label className="mt-5 block text-sm font-semibold">
        Email
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
      </label>
      <label className="mt-5 block text-sm font-semibold">
        What do you need?
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} className={field} />
      </label>
      {/* Honeypot: real people never see or fill this. */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {err} You can also email me at <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn-solid mt-6 w-full sm:w-auto">
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
