import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function Admin() {
  const status = {
    admin: adminConfigured(),
    db: dbConfigured(),
    cloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
    email: !!process.env.RESEND_API_KEY,
  };
  return (
    <div className="min-h-screen pb-16 pt-8">
      {isAdmin() ? <AdminApp status={status} /> : <AdminLogin configured={status.admin} />}
    </div>
  );
}
