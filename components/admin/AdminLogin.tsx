"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useThreeOn } from "@/lib/theme";

const ModelNameView = dynamic(() => import("@/components/three/ModelNameView"), { ssr: false });

export default function AdminLogin({ configured }: { configured: boolean }) {
  const three = useThreeOn();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) location.reload();
    else setErr(j.error || "Could not sign in.");
  }
  return (
    <div className="page grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-md">
        <div className="relative h-40">
          {three ? <ModelNameView model={{ slug: "admin", name: "Admin", kind: "", line: "", details: [], specs: [], link: "", linkLabel: "", tone: "#a3a3a3" }} /> : <p className="grid h-full place-items-center font-display text-6xl font-extrabold">Admin</p>}
        </div>
        <form onSubmit={submit} className="glass mt-4 rounded-xl3 p-6">
          {!configured && (
            <p className="mb-4 rounded-2xl border border-line p-3 text-sm text-fg/80">
              Admin is locked. Add <code>ADMIN_PASSWORD</code> (10+ characters) and <code>ADMIN_SECRET</code> to your Vercel environment, then redeploy.
            </p>
          )}
          <label className="block text-sm font-semibold">
            Password
            <input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 outline-none focus:border-fg" />
          </label>
          {err && <p className="mt-3 text-sm text-red-600" role="alert">{err}</p>}
          <button disabled={busy || !configured} className="btn-solid mt-5 w-full">{busy ? "Checking..." : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
