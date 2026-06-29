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
  const [tab, setTab] = useState<"blogs" | "gallery" | "reviews" | "comments">("blogs");
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
          {((["blogs", "gallery", "reviews", "comments"] as const)).map((t) => (
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
        {tab === "comments" && <CommentsAdmin adminKey={key || ""} />}
      </div>
    </div>
  );
}

// ─── BLOG ADMIN ──────────────────────────────────────────────────────────────

function BlogAdmin() {
  type BlogItem = { id: string; title: string; slug: string; excerpt: string; content: string; category: string; tags: string[]; published: boolean; publishedAt: string | null; readingTime?: number; views: number; createdAt: string };
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [view, setView] = useState<"list" | "new" | "edit">("list");
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/blogs");
      const d = await r.json();
      setBlogs(Array.isArray(d) ? d : []);
    } catch { setBlogs([]); }
    setLoading(false);
  };

  useEffect(() => { loadBlogs(); }, []);

  const openEdit = (b: BlogItem) => {
    setEditing(b);
    setTitle(b.title); setSlug(b.slug); setCategory(b.category);
    setExcerpt(b.excerpt); setContent(b.content);
    setTags(b.tags.join(", ")); setPublished(b.published);
    setView("edit");
  };

  const openNew = () => {
    setEditing(null);
    setTitle(""); setSlug(""); setCategory("Engineering");
    setExcerpt(""); setContent(""); setTags(""); setPublished(false);
    setView("new");
  };

  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const save = async () => {
    if (!title || !slug || !excerpt || !content) { setMsg("Fill all required fields"); return; }
    setSaving(true);
    const payload = { title, slug, excerpt, content, category, tags: tags.split(",").map(t => t.trim()).filter(Boolean), published, readingTime: Math.ceil(content.split(" ").length / 200), publishedAt: published ? new Date().toISOString() : null };
    try {
      let res;
      if (editing) {
        res = await fetch("/api/admin/blogs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...payload }) });
      } else {
        res = await fetch("/api/admin/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (res.ok) { setMsg(editing ? "Updated!" : "Published!"); await loadBlogs(); setView("list"); }
      else setMsg("Save failed");
    } catch { setMsg("Error"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const deleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
    setMsg("Deleted"); await loadBlogs();
    setTimeout(() => setMsg(""), 2500);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";

  if (view === "new" || view === "edit") return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setView("list")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
        <h2 className="text-xl font-extrabold text-foreground">{view === "edit" ? "Edit Post" : "New Post"}</h2>
      </div>
      {msg && <p className="text-sm font-bold text-emerald-600">{msg}</p>}
      <input value={title} onChange={e => { setTitle(e.target.value); if (!editing) setSlug(autoSlug(e.target.value)); }} placeholder="Post title *" className={inputCls} />
      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug (auto-filled)" className={inputCls} />
      <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short excerpt *" className={inputCls} />
      <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
        {["Engineering","AI/ML","Career","Product","Tutorial","Other"].map(c => <option key={c}>{c}</option>)}
      </select>
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className={inputCls} />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post in Markdown *" rows={16} className={cn(inputCls, "resize-none font-mono text-xs")} />
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 rounded" />
        <span className="text-sm font-bold text-foreground">Publish immediately</span>
      </label>
      <button onClick={save} disabled={saving} className="btn-primary w-full justify-center">
        {saving ? "Saving..." : view === "edit" ? "Save Changes" : "Publish Post"}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Blog Posts</h2>
          <p className="text-sm text-muted-foreground mt-1">{blogs.length} posts total</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl">{msg}</span>}
          <button onClick={openNew} className="btn-primary text-sm">+ New Post</button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-bold text-foreground">No posts yet</p>
          <button onClick={openNew} className="btn-outline text-sm mt-4">Write your first post</button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl border border-border bg-card flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-widest",
                    b.published ? "bg-foreground text-background" : "border border-border text-muted-foreground")}>
                    {b.published ? "Live" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">{b.category}</span>
                  <span className="text-xs text-muted-foreground">· {b.views} views</span>
                </div>
                <p className="font-extrabold text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{b.excerpt}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(b)}
                  className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                  Edit
                </button>
                <button onClick={() => deleteBlog(b.id, b.title)}
                  className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryAdmin() {
  type GalleryItem = { id: string; title: string; description?: string; imageUrl: string; category?: string; createdAt: string };
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [msg, setMsg] = useState("");

  // Upload form
  const [cloudName, setCloudName] = useState("");
  const [preset, setPreset] = useState("");
  const [configSaved, setConfigSaved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Work");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const cn = localStorage.getItem("cld_name") || "";
    const cp = localStorage.getItem("cld_preset") || "";
    if (cn) { setCloudName(cn); setPreset(cp); setConfigSaved(true); }
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/gallery");
      const d = await r.json();
      setItems(Array.isArray(d) ? d : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  const saveConfig = () => {
    localStorage.setItem("cld_name", cloudName);
    localStorage.setItem("cld_preset", preset);
    setConfigSaved(true);
    setMsg("Config saved");
    setTimeout(() => setMsg(""), 2000);
  };

  const upload = async () => {
    if (!file || !title || !cloudName || !preset) { setMsg("Fill all fields and configure Cloudinary"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", preset);
      const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const data = await r.json();
      if (!data.secure_url) throw new Error("Upload failed");
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, imageUrl: data.secure_url, category, published: true, featured: false, sortOrder: 0 }),
      });
      setMsg("Uploaded!"); setFile(null); setTitle(""); setDesc("");
      await loadItems();
    } catch { setMsg("Upload failed"); }
    setUploading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description || "");
  };

  const saveEdit = async (id: string) => {
    await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editTitle, description: editDesc }),
    });
    setMsg("Updated!"); setEditingId(null);
    await loadItems();
    setTimeout(() => setMsg(""), 2500);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this image permanently?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    setMsg("Deleted"); await loadItems();
    setTimeout(() => setMsg(""), 2500);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-extrabold text-foreground">Gallery</h2>
        {msg && <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl">{msg}</span>}
      </div>

      {/* Cloudinary config */}
      {!configSaved ? (
        <div className="card-surface p-5 space-y-3">
          <p className="text-sm font-bold text-foreground">Set up Cloudinary (one-time)</p>
          <input value={cloudName} onChange={e => setCloudName(e.target.value)} placeholder="Cloud Name" className={inputCls} />
          <input value={preset} onChange={e => setPreset(e.target.value)} placeholder="Upload Preset (unsigned)" className={inputCls} />
          <button onClick={saveConfig} className="btn-primary text-sm">Save Config</button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-bold">Cloudinary: {cloudName} · <button onClick={() => setConfigSaved(false)} className="underline">Change</button></p>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Image title *" className={inputCls} />
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Caption (optional)" className={inputCls} />
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
            {["Work","BTS","Events","Creative"].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={upload} disabled={uploading} className="btn-primary w-full justify-center text-sm">
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      )}

      {/* Gallery items */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground text-sm">No images yet — upload one above</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-extrabold text-foreground">{items.length} images</p>
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                      <input value={editDesc} onChange={e => setEditDesc(e.target.value)}
                        placeholder="Caption"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(item.id)}
                          className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-extrabold text-foreground text-sm">{item.title}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      {item.category && <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.category}</p>}
                    </>
                  )}
                </div>
              </div>
              {editingId !== item.id && (
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Edit Caption
                  </button>
                  <button onClick={() => deleteItem(item.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewAdmin() {
  type ReviewItem = { id: string; name: string; role?: string; company?: string; content: string; status: string; rating: number; createdAt: string };
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reviews");
      const d = await r.json();
      setReviews(Array.isArray(d) ? d : []);
    } catch { setReviews([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMsg(status === "APPROVED" ? "Approved!" : status === "REJECTED" ? "Rejected" : "Updated");
    setTimeout(() => setMsg(""), 2500);
    load();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setMsg("Deleted");
    setTimeout(() => setMsg(""), 2500);
    load();
  };

  const filtered = reviews.filter(r => r.status === filter);

  const counts = {
    PENDING:  reviews.filter(r => r.status === "PENDING").length,
    APPROVED: reviews.filter(r => r.status === "APPROVED").length,
    REJECTED: reviews.filter(r => r.status === "REJECTED").length,
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">Approve reviews to make them public on /reviews</p>
        </div>
        {msg && <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl">{msg}</span>}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-colors",
              filter === f ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
            )}>
            {f.charAt(0) + f.slice(1).toLowerCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-bold text-foreground">No {filter.toLowerCase()} reviews</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "PENDING" ? "New reviews from /reviews appear here." : `No reviews marked as ${filter.toLowerCase()} yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-extrabold text-foreground">{r.name}</p>
                  {(r.role || r.company) && (
                    <p className="text-xs text-muted-foreground">{[r.role, r.company].filter(Boolean).join(" · ")}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{fmt(r.createdAt)} · {"★".repeat(r.rating)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {filter !== "APPROVED" && (
                    <button onClick={() => updateStatus(r.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity">
                      Approve
                    </button>
                  )}
                  {filter !== "REJECTED" && (
                    <button onClick={() => updateStatus(r.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Reject
                    </button>
                  )}
                  {filter === "REJECTED" && (
                    <button onClick={() => updateStatus(r.id, "PENDING")}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                      Move to Pending
                    </button>
                  )}
                  <button onClick={() => deleteReview(r.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-secondary rounded-xl px-4 py-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{r.content}</p>
              </div>
              {filter === "APPROVED" && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Visible on /reviews
                </span>
              )}
            </div>
          ))}
        </div>
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

// ─── COMMENTS ADMIN ─────────────────────────────────────────────────────────
function CommentsAdmin({ adminKey }: { adminKey: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved">("pending");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/comments?key=${adminKey}&status=${filter}`);
      const data = await r.json();
      setComments(Array.isArray(data) ? data : []);
    } catch { setComments([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id: string) => {
    await fetch(`/api/admin/comments?key=${adminKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: true }),
    });
    setMsg("Approved");
    setTimeout(() => setMsg(""), 2000);
    load();
  };

  const reject = async (id: string) => {
    await fetch(`/api/admin/comments?key=${adminKey}&id=${id}`, { method: "DELETE" });
    setMsg("Deleted");
    setTimeout(() => setMsg(""), 2000);
    load();
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Blog Comments</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comments submitted on blog posts. Approve to make them visible to readers.
          </p>
        </div>
        {msg && (
          <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl">
            {msg}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors",
              filter === f
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-bold text-foreground">No {filter} comments</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "pending"
              ? "When readers submit comments on blog posts, they appear here."
              : "Approved comments show on the blog post for all readers."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <div key={c.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-foreground text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                  {c.blog && (
                    <p className="text-xs text-muted-foreground">
                      On:{" "}
                      <a href={`/blog/${c.blog.slug}`} target="_blank" rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground transition-colors">
                        {c.blog.title}
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{fmt(c.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {!c.approved && (
                    <button
                      onClick={() => approve(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => reject(c.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-secondary rounded-xl px-4 py-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
              </div>
              {c.approved && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Visible to readers
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
