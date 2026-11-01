"use client";
// components/sections/Reviews.tsx
// Real reviews only: people submit them here, and they appear after I approve them in the admin page.
// Until there are approved reviews, the section simply invites the first ones (no placeholder quotes).
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please add your name"),
  email: z.string().email("Please add a valid email"),
  role: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  content: z.string().min(10, "A little more detail, please").max(1000),
  rating: z.number().int().min(1).max(5),
});
type FormData = z.infer<typeof schema>;
type Review = { id: string; name: string; role?: string | null; company?: string | null; content: string; rating: number; createdAt: string };

function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" disabled={!onChange} onClick={() => onChange?.(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`}
          className={cn(onChange ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default")}>
          <Star size={size} className={i <= value ? "fill-amber-400 text-amber-400" : "text-foreground/20"} />
        </button>
      ))}
    </div>
  );
}

const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rating, setRating] = useState(5);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { rating: 5 } });

  useEffect(() => {
    fetch("/api/reviews").then((r) => r.json()).then((d) => setReviews(Array.isArray(d) ? d : [])).catch(() => setReviews([]));
  }, []);

  const onSubmit = async (data: FormData) => {
    setState("loading");
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    if (res?.ok) { setState("success"); reset(); setRating(5); } else setState("error");
  };

  const list = reviews ?? [];
  const avg = list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
  const [lead, ...rest] = list;
  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/50";

  return (
    <section id="reviews" className="py-section">
      <div className="container-padded">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <h2 className="section-heading">Reviews</h2>
            <p className="mt-3 text-lg text-muted-foreground">What people I have worked with say about it.</p>
          </div>
          {list.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="font-display text-5xl font-extrabold tracking-tight text-foreground">{avg.toFixed(1)}</p>
              <div>
                <Stars value={Math.round(avg)} />
                <p className="mt-1 text-sm text-muted-foreground">from {list.length} review{list.length > 1 ? "s" : ""}</p>
              </div>
            </div>
          )}
        </div>

        {list.length > 0 && (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            {/* the latest review, large */}
            <figure className="card-surface flex flex-col justify-between p-8 md:p-10">
              <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight text-foreground md:text-[1.75rem]">
                &ldquo;{lead.content}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-foreground font-display text-sm font-bold text-background">{initials(lead.name)}</span>
                <span>
                  <span className="block font-semibold text-foreground">{lead.name}</span>
                  <span className="block text-sm text-muted-foreground">{[lead.role, lead.company].filter(Boolean).join(", ")}</span>
                </span>
                <span className="ml-auto"><Stars value={lead.rating} /></span>
              </figcaption>
            </figure>
            <div className="grid gap-5">
              {rest.slice(0, 2).map((r) => (
                <figure key={r.id} className="card-surface p-6">
                  <Stars value={r.rating} size={14} />
                  <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/85">&ldquo;{r.content}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm"><span className="font-semibold text-foreground">{r.name}</span> <span className="text-muted-foreground">{[r.role, r.company].filter(Boolean).join(", ")}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
        {rest.length > 2 && (
          <div className="mt-5 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
            {rest.slice(2).map((r) => (
              <figure key={r.id} className="card-surface break-inside-avoid p-6">
                <Stars value={r.rating} size={14} />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/85">&ldquo;{r.content}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm"><span className="font-semibold text-foreground">{r.name}</span> <span className="text-muted-foreground">{[r.role, r.company].filter(Boolean).join(", ")}</span></figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* leave a review */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
              {list.length ? "Worked with me? Leave a review." : "Worked with me? Be the first to leave a review."}
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-foreground/70">
              Clients, teammates and collaborators are welcome. Reviews appear once I have checked them, and your email is never shown.
            </p>
          </div>
          {state === "success" ? (
            <div className="card-surface flex flex-col items-center justify-center p-10 text-center">
              <p className="font-display text-xl font-extrabold text-foreground">Thank you.</p>
              <p className="mt-1 text-sm text-muted-foreground">Your review will appear here once it is approved.</p>
              <button onClick={() => setState("idle")} className="btn-outline mt-5 text-sm">Write another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card-surface grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2"><p className="mb-2 text-sm font-medium text-foreground">Your rating</p><Stars value={rating} size={22} onChange={(v) => { setRating(v); setValue("rating", v); }} /></div>
              <label className="text-sm font-medium text-foreground">Name<input {...register("name")} className={cn(field, "mt-1.5")} />{errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>}</label>
              <label className="text-sm font-medium text-foreground">Email<input type="email" {...register("email")} className={cn(field, "mt-1.5")} />{errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>}</label>
              <label className="text-sm font-medium text-foreground">Role (optional)<input {...register("role")} className={cn(field, "mt-1.5")} /></label>
              <label className="text-sm font-medium text-foreground">Company (optional)<input {...register("company")} className={cn(field, "mt-1.5")} /></label>
              <label className="text-sm font-medium text-foreground sm:col-span-2">Your review<textarea rows={4} {...register("content")} className={cn(field, "mt-1.5 resize-y")} />{errors.content && <span className="mt-1 block text-xs text-red-500">{errors.content.message}</span>}</label>
              <div className="flex items-center gap-4 sm:col-span-2">
                <button disabled={state === "loading"} className="btn-primary text-sm disabled:opacity-60">{state === "loading" ? "Sending..." : "Submit review"}</button>
                {state === "error" && <span className="text-sm text-muted-foreground">Could not send right now. Please try again later.</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
