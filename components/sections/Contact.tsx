"use client";
// components/sections/Contact.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

type FormData = z.infer<typeof schema>;

export function ContactSection() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("success");
        reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section id="contact" className="py-section">
      <div className="container-padded">
        <div className="max-w-xl mx-auto space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-heading">Contact.</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Have a project in mind or just want to talk? I&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* Contact CTA card — Allwell style */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-foreground text-background p-8 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-background/70">
                Available for new projects
              </span>
            </div>
            <h3 className="text-2xl font-bold">Let&apos;s Work Together</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Currently open to freelance contracts, full-time roles, and interesting
              collaborations. If you have a project in mind or just want to talk,
              I&apos;d love to hear from you.
            </p>
            <a
              href="mailto:contact@ememzyvisuals.com"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-background text-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get in Touch →
            </a>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {state === "success" ? (
              <div className="card-surface p-10 flex flex-col items-center justify-center gap-4 text-center">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <div>
                  <h3 className="font-bold text-lg">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Emmanuel will get back to you soon.
                  </p>
                </div>
                <button
                  onClick={() => setState("idle")}
                  className="btn-outline text-sm"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="name">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground",
                      "outline-none focus:ring-2 focus:ring-ring transition-all",
                      errors.name ? "border-red-400" : "border-border"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground",
                      "outline-none focus:ring-2 focus:ring-ring transition-all",
                      errors.email ? "border-red-400" : "border-border"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground",
                      "outline-none focus:ring-2 focus:ring-ring transition-all resize-none",
                      errors.message ? "border-red-400" : "border-border"
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.message.message}
                    </p>
                  )}
                </div>

                {state === "error" && (
                  <p className="text-sm text-red-500">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className={cn(
                    "btn-primary w-full justify-center",
                    state === "loading" && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {state === "loading" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
