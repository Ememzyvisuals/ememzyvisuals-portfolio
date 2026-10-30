"use client";
// components/sections/Reviews.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, CheckCircle2, MessageSquarePlus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(10, "Review too short").max(1000),
  rating: z.number().min(1).max(5).default(5),
});

type FormData = z.infer<typeof schema>;

interface Review {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  createdAt: string;
}

// Static placeholder reviews (shown before DB has approved reviews)
const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    role: "Product Manager",
    company: "TechCorp NG",
    content:
      "Emmanuel delivered beyond expectations. The ClaudGPT integration we discussed was implemented flawlessly — the multi-agent pipeline was exactly what we needed.",
    rating: 5,
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "Kelechi Nwosu",
    role: "Startup Founder",
    company: "LaunchPad Africa",
    content:
      "The AI system Emmanuel built for our platform reduced our support overhead by 60%. He understood our requirements deeply and delivered a production-ready solution.",
    rating: 5,
    createdAt: "2025-11-15",
  },
  {
    id: "3",
    name: "Tobi Adeleke",
    role: "Software Engineer",
    content:
      "I've worked with many developers but Emmanuel's depth across AI, backend, and frontend is rare. NaijaPrep was an incredible build — offline-first with real attention to user experience.",
    rating: 5,
    createdAt: "2025-10-20",
  },
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            className={cn(
              "transition-colors",
              (hover || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-border"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(PLACEHOLDER_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  useEffect(() => {
    // Try to fetch approved reviews from the API
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setReviews(data);
      })
      .catch(() => {}); // Silently fall back to placeholder
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitState("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating }),
      });
      if (res.ok) {
        setSubmitState("success");
        reset();
        setRating(5);
      } else {
        setSubmitState("error");
      }
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section id="reviews" className="py-section">
      <div className="container-padded space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="section-heading">Reviews.</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              What people say about working with Emmanuel.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-outline self-start text-sm"
          >
            <MessageSquarePlus size={15} />
            Leave a Review
          </button>
        </motion.div>

        {/* Review form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="card-surface p-6 md:p-8">
                {submitState === "success" ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-lg">Review Submitted!</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Thank you! Your review will be published after moderation.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitState("idle"); setShowForm(false); }}
                      className="btn-outline text-sm"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <h3 className="font-bold text-lg">Write a Review</h3>

                    {/* Rating */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Rating</label>
                      <StarRating value={rating} onChange={(v) => { setRating(v); setValue("rating", v); }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Name *</label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Your name"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border bg-background text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all",
                            errors.name ? "border-red-400" : "border-border"
                          )}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email *</label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="your@email.com"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl border bg-background text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all",
                            errors.email ? "border-red-400" : "border-border"
                          )}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                      </div>

                      {/* Role */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Role (optional)</label>
                        <input
                          {...register("role")}
                          type="text"
                          placeholder="e.g. Product Manager"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company (optional)</label>
                        <input
                          {...register("company")}
                          type="text"
                          placeholder="e.g. TechCorp"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>
                    </div>

                    {/* Review content */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Review *</label>
                      <textarea
                        {...register("content")}
                        rows={4}
                        placeholder="Share your experience working with Emmanuel..."
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border bg-background text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all resize-none",
                          errors.content ? "border-red-400" : "border-border"
                        )}
                      />
                      {errors.content && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors.content.message}
                        </p>
                      )}
                    </div>

                    {submitState === "error" && (
                      <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitState === "loading"}
                        className={cn("btn-primary", submitState === "loading" && "opacity-70")}
                      >
                        {submitState === "loading" ? "Submitting..." : "Submit Review"}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                        Cancel
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Reviews are published after moderation. Your email won&apos;t be displayed publicly.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-surface p-6 space-y-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, si) => (
                  <Star key={si} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-foreground">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  {(review.role || review.company) && (
                    <p className="text-xs text-muted-foreground">
                      {[review.role, review.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
