"use client";
// app/admin/page.tsx

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [tab, setTab] = useState<"blogs" | "gallery" | "reviews">("blogs");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "emmzy2025";
    if (key === adminKey) setAuthed(true);
  }, [key]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-2xl font-bold">Access denied</p>
          <p className="text-muted-foreground text-sm">
            Go to <code className="bg-secondary px-2 py-0.5 rounded">/admin?key=YOUR_KEY</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-padded space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your portfolio content — everything you post here is visible to all visitors
          </p>
        </div>

        <div className="flex gap-0 border-b border-border">
          {(["blogs", "gallery", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors",
                tab === t
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "blogs" && <BlogAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "reviews" && <ReviewAdmin />}
      </div>
    </div>
  );
}

// ─── BLOG ADMIN ──────────────────────────────────────────────────────────────

function BlogAdmin() {
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    category: "Engineering", tags: "", published: true,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");

  const handleSubmit = async () => {
    if (!form.title || !form.content) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || autoSlug(form.title),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          readingTime: Math.ceil(form.content.split(" ").length / 200),
          publishedAt: form.published ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        setStatus("done");
        setForm({ title: "", slug: "", excerpt: "", content: "", category: "Engineering", tags: "", published: true });
        setTimeout(() => setStatus("idle"), 3000);
      } else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Info box */}
      <div className="card-surface p-4 border-l-4 border-emerald-500">
        <p className="text-sm font-semibold text-foreground">Blog posts are public</p>
        <p className="text-xs text-muted-foreground mt-1">
          Once published, your blog post appears at <strong>/blogs</strong> and its own page at <strong>/blog/your-slug</strong>.
          All visitors can read it — no login required.
        </p>
      </div>

      <div className="card-surface p-6 space-y-5">
        <h2 className="font-bold text-lg">Write a Blog Post</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
              placeholder="e.g. How I Built TruthGuard"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Slug (auto-fills)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none"
            >
              {["Engineering", "AI/ML", "Automation", "Benchmarks", "Career", "Tutorial"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Excerpt (short summary shown on listing page)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="A short summary of the post..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Content — Markdown supported</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={18}
              placeholder={`# Your heading\n\nWrite your post here. Markdown works:\n\n**Bold text**, *italic*, [links](https://url.com)\n\n## Section heading\n\nParagraph text...\n\n\`\`\`python\nprint("code blocks work too")\n\`\`\``}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
            />
            <p className="text-xs text-muted-foreground">
              To add an image in your post: upload it to Cloudinary, copy the URL, then write{" "}
              <code className="bg-secondary px-1 rounded">![description](URL)</code> in your content
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="AI, LLM, Python, Benchmark"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, published: !form.published })}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors cursor-pointer relative",
                  form.published ? "bg-foreground" : "bg-border"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  form.published ? "translate-x-6" : "translate-x-1"
                )} />
              </div>
              <span className="text-sm font-medium">
                {form.published ? "Publish immediately (visible to everyone)" : "Save as draft (hidden)"}
              </span>
            </label>
          </div>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle size={14} /> Error saving. Check your database connection.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!form.title || !form.content || status === "saving"}
          className={cn("btn-primary", (!form.title || !form.content || status === "saving") && "opacity-50")}
        >
          {status === "saving" ? "Publishing..." : status === "done" ? "✓ Published!" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}

// ─── GALLERY ADMIN ────────────────────────────────────────────────────────────

function GalleryAdmin() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "creative" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [cloudName, setCloudName] = useState("");
  const [uploadPreset, setUploadPreset] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

  // Load saved Cloudinary config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cloudinary_config");
    if (saved) {
      const { cloud, preset } = JSON.parse(saved);
      setCloudName(cloud);
      setUploadPreset(preset);
      setConfigSaved(true);
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem("cloudinary_config", JSON.stringify({ cloud: cloudName, preset: uploadPreset }));
    setConfigSaved(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      alert("Please enter your Cloudinary Cloud Name and Upload Preset first");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch {
      alert("Upload failed. Check your Cloud Name and Upload Preset.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl || !form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, published: true }),
      });
      if (res.ok) {
        setDone(true);
        setImageUrl("");
        setForm({ title: "", description: "", category: "creative" });
        setTimeout(() => setDone(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info box */}
      <div className="card-surface p-4 border-l-4 border-emerald-500">
        <p className="text-sm font-semibold text-foreground">Gallery images are public</p>
        <p className="text-xs text-muted-foreground mt-1">
          Once uploaded, images appear at <strong>/gallery</strong> for all visitors to see.
          Images are stored on Cloudinary (free CDN) — not your database — so no storage limits.
        </p>
      </div>

      {/* Step 1 — Cloudinary config */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Step 1 — Connect Cloudinary (one time setup)</h3>
          {configSaved && <span className="text-xs text-emerald-600 font-semibold">✓ Saved</span>}
        </div>

        <div className="card-surface p-4 bg-secondary space-y-2">
          <p className="text-xs font-semibold text-foreground">How to get these values (2 minutes, free):</p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Go to <strong>cloudinary.com</strong> → Sign Up (free, 25GB storage)</li>
            <li>On your dashboard, copy your <strong>Cloud Name</strong></li>
            <li>Go to Settings → Upload → scroll to <strong>Upload Presets</strong></li>
            <li>Click Add Upload Preset → set Signing Mode to <strong>Unsigned</strong> → Save</li>
            <li>Copy the preset name and paste it below</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Cloud Name</label>
            <input
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              placeholder="e.g. dxyz123abc"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Upload Preset</label>
            <input
              value={uploadPreset}
              onChange={(e) => setUploadPreset(e.target.value)}
              placeholder="e.g. emmzyvisuals_unsigned"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>
        </div>

        <button onClick={saveConfig} className="btn-primary text-sm">
          Save Config
        </button>
      </div>

      {/* Step 2 — Upload image */}
      <div className="card-surface p-6 space-y-5">
        <h3 className="font-bold">Step 2 — Upload Image</h3>

        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="gallery-upload"
            disabled={!configSaved}
          />
          <label
            htmlFor="gallery-upload"
            className={cn(
              "block cursor-pointer space-y-3",
              !configSaved && "opacity-40 cursor-not-allowed"
            )}
          >
            {imageUrl ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="max-h-52 mx-auto rounded-xl object-cover" />
                <p className="text-xs text-emerald-600 font-semibold">Uploaded to Cloudinary</p>
              </div>
            ) : (
              <>
                <p className="text-3xl">{uploading ? "..." : "+"}</p>
                <p className="text-sm font-medium">
                  {uploading ? "Uploading to Cloudinary..." : !configSaved ? "Save your Cloudinary config first" : "Click to choose an image"}
                </p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP · Stored on Cloudinary CDN</p>
              </>
            )}
          </label>
        </div>

        {imageUrl && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Title / Caption *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Late night coding session"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Description (optional)</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A bit more context..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none"
                >
                  <option value="creative">Creative</option>
                  <option value="bts">Behind the Scenes</option>
                  <option value="events">Events</option>
                  <option value="work">Work</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!form.title || saving}
              className={cn("btn-primary", (!form.title || saving) && "opacity-50")}
            >
              {saving ? "Saving..." : done ? "✓ Added to Gallery!" : "Add to Gallery"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REVIEW ADMIN ─────────────────────────────────────────────────────────────

function ReviewAdmin() {
  type ReviewItem = { id: string; name: string; role?: string; company?: string; content: string; status: string; rating: number; createdAt: string };
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="card-surface p-4 border-l-4 border-emerald-500">
        <p className="text-sm font-semibold text-foreground">Approved reviews are public</p>
        <p className="text-xs text-muted-foreground mt-1">
          Reviews submitted from the /reviews page come here as <strong>Pending</strong>. Approve them to make them visible to all visitors.
        </p>
      </div>

      <h2 className="font-bold text-lg">Moderate Reviews ({reviews.length})</h2>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : reviews.length === 0 ? (
        <div className="card-surface p-8 text-center text-muted-foreground text-sm">
          No reviews yet. They appear here when someone submits one from /reviews
        </div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="card-surface p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.name}</p>
                {(r.role || r.company) && (
                  <p className="text-xs text-muted-foreground">{[r.role, r.company].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full font-semibold",
                r.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                r.status === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" :
                "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              )}>
                {r.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.content}</p>
            {r.status === "PENDING" && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => updateStatus(r.id, "APPROVED")}
                  className="text-xs px-4 py-2 rounded-lg bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
                >
                  Approve — make public
                </button>
                <button
                  onClick={() => updateStatus(r.id, "REJECTED")}
                  className="text-xs px-4 py-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <AdminContent />
    </Suspense>
  );
}
