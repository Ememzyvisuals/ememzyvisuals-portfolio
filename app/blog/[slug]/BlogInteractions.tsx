"use client";
// app/blog/[slug]/BlogInteractions.tsx

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, Send } from "lucide-react";

// ── Share icons ──────────────────────────────────────────────────────────────

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.28 8.28 0 004.84 1.55V6.85a4.85 4.85 0 01-1.07-.16z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface Props {
  blogId: string;
  slug: string;
  shareUrl: string;
  shareText: string;
  initialComments: Comment[];
}

// ── Component ────────────────────────────────────────────────────────────────

export function BlogInteractions({ blogId, slug, shareUrl, shareText, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Track view on mount
  useEffect(() => {
    const viewed = sessionStorage.getItem(`viewed-${slug}`);
    if (!viewed) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
      sessionStorage.setItem(`viewed-${slug}`, "1");
    }
  }, [slug]);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    tiktok: `https://www.tiktok.com/share?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.content) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, ...form }),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", content: "" });
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12 space-y-10">

      {/* ── Share section ────────────────────────────────────── */}
      <div className="pt-6 border-t border-border space-y-4">
        <p className="text-sm font-bold text-foreground">Share this post</p>
        <div className="flex flex-wrap gap-3">

          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 transition-opacity">
            <TwitterIcon /> Share on X
          </a>

          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-semibold hover:opacity-85 transition-opacity">
            <FacebookIcon /> Share on Facebook
          </a>

          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-85 transition-opacity">
            <WhatsAppIcon /> Share on WhatsApp
          </a>

          <a href={shareLinks.tiktok} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-85 transition-opacity">
            <TikTokIcon /> Share on TikTok
          </a>
        </div>
      </div>

      {/* ── Comments section ─────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} />
          <p className="text-sm font-bold text-foreground">
            Comments {comments.length > 0 && `(${comments.length})`}
          </p>
        </div>

        {/* Existing comments */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="card-surface p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to leave one.
          </p>
        )}

        {/* Comment form */}
        {submitted ? (
          <div className="card-surface p-5 text-center space-y-1">
            <p className="font-semibold text-foreground">Comment submitted</p>
            <p className="text-sm text-muted-foreground">
              It will appear once approved.
            </p>
          </div>
        ) : (
          <div className="card-surface p-6 space-y-4">
            <p className="text-sm font-bold">Leave a comment</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comment</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                placeholder="What are your thoughts?"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.email || !form.content || submitting}
              className={cn(
                "btn-primary text-sm gap-2",
                (!form.name || !form.email || !form.content || submitting) && "opacity-50"
              )}
            >
              <Send size={14} />
              {submitting ? "Submitting..." : "Submit Comment"}
            </button>
            <p className="text-xs text-muted-foreground">
              Comments are reviewed before appearing publicly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
