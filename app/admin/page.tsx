"use client";
// app/admin/page.tsx
// Simple admin panel — password protected, no extra paid services
// Access at: yoursite.com/admin?key=YOUR_ADMIN_KEY

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [tab, setTab] = useState<"blogs" | "gallery" | "reviews">("blogs");
  const [authed, setAuthed] = useState(false);

  // Simple key check — set NEXT_PUBLIC_ADMIN_KEY in your .env
  useEffect(() => {
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY || "emmzy2025";
    if (key === adminKey) setAuthed(true);
  }, [key]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-2xl font-bold">🔒 Admin Access</p>
          <p className="text-muted-foreground text-sm">
            Access via: <code className="bg-secondary px-2 py-0.5 rounded">/admin?key=YOUR_KEY</code>
          </p>
          <p className="text-xs text-muted-foreground">Set NEXT_PUBLIC_ADMIN_KEY in your .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-padded space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your portfolio content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-0">
          {(["blogs", "gallery", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
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
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Engineering",
    tags: "",
    published: false,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const handleSubmit = async () => {
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
      if (res.ok) { setStatus("done"); setForm({ title: "", slug: "", excerpt: "", content: "", category: "Engineering", tags: "", published: false }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card-surface p-6 space-y-5">
        <h2 className="font-bold text-lg">Write a Blog Post</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
              placeholder="e.g. How I Built TruthGuard"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Slug (auto-generated)</label>
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
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {["Engineering", "AI/ML", "Automation", "Benchmarks", "Career", "Tutorial"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Excerpt (shown on listing page)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="A short summary of the post..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Content (Markdown supported ✓)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={16}
              placeholder={`# How I Built TruthGuard\n\nStart writing your post here in **markdown**.\n\n## Section 1\n\nYour content...\n\n\`\`\`python\nprint("code blocks work too")\n\`\`\``}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Supports full Markdown: **bold**, *italic*, # headings, ```code blocks```, links, images
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="AI, LLM, Python, Benchmark"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.title || !form.content || status === "saving"}
          className="btn-primary"
        >
          {status === "saving" ? "Saving..." : status === "done" ? "✅ Published!" : "Publish Post"}
        </button>
        {status === "error" && <p className="text-sm text-red-500">Error saving — check your database connection.</p>}
      </div>

      <div className="card-surface p-5">
        <p className="text-sm font-semibold mb-2">📝 How to add a cover image to a blog post</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Go to the Gallery tab and upload your image</li>
          <li>Copy the image URL that appears after upload</li>
          <li>In your markdown content, add: <code className="bg-secondary px-1 rounded">![Alt text](YOUR_URL)</code></li>
          <li>Or update the post coverImage field in Prisma Studio</li>
        </ol>
      </div>
    </div>
  );
}

// ─── GALLERY ADMIN ────────────────────────────────────────────────────────────

function GalleryAdmin() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [form, setForm] = useState({ title: "", description: "", category: "creative" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Using a free Cloudinary unsigned upload (no API key needed for unsigned)
    // OR just save as base64 URL for local dev
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedUrl(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!uploadedUrl || !form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: uploadedUrl, published: true }),
      });
      if (res.ok) { setDone(true); setUploadedUrl(""); setForm({ title: "", description: "", category: "creative" }); }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card-surface p-6 space-y-5">
        <h2 className="font-bold text-lg">Upload Gallery Image</h2>

        {/* File upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Image *</label>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-foreground/30 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload" className="cursor-pointer space-y-2 block">
              {uploadedUrl ? (
                <div className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                  <p className="text-xs text-emerald-600 font-medium">✓ Image ready</p>
                </div>
              ) : (
                <>
                  <p className="text-3xl">🖼️</p>
                  <p className="text-sm font-medium">{uploading ? "Loading..." : "Click to upload image"}</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP supported</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Title / Caption *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Working on Microdragon at 2am"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-medium">Description (optional)</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A bit more context about this photo..."
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
          disabled={!uploadedUrl || !form.title || saving}
          className="btn-primary"
        >
          {saving ? "Saving..." : done ? "✅ Added to Gallery!" : "Add to Gallery"}
        </button>
      </div>

      <div className="card-surface p-5">
        <p className="text-sm font-semibold mb-2">💡 For production image hosting (free)</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Go to <strong>cloudinary.com</strong> — create a free account (25GB free)</li>
          <li>Get your <code className="bg-secondary px-1 rounded">CLOUDINARY_URL</code> and add to .env.local</li>
          <li>Images will be stored on Cloudinary CDN instead of base64</li>
        </ol>
      </div>
    </div>
  );
}

// ─── REVIEW ADMIN ─────────────────────────────────────────────────────────────

function ReviewAdmin() {
  const [reviews, setReviews] = useState<Array<{ id: string; name: string; content: string; status: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(d); setLoading(false); })
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
      <h2 className="font-bold text-lg">Moderate Reviews</h2>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : reviews.length === 0 ? (
        <div className="card-surface p-8 text-center text-muted-foreground text-sm">No reviews yet</div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="card-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.name}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                r.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                r.status === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" :
                "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}>{r.status}</span>
            </div>
            <p className="text-sm text-muted-foreground">{r.content}</p>
            {r.status === "PENDING" && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(r.id, "APPROVED")} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">Approve</button>
                <button onClick={() => updateStatus(r.id, "REJECTED")} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors dark:bg-red-950 dark:text-red-300">Reject</button>
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
    <Suspense>
      <AdminContent />
    </Suspense>
  );
}
