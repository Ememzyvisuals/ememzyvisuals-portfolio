// types/index.ts

export type ProjectStatus = "COMPLETED" | "IN_DEVELOPMENT" | "ARCHIVED";
export type ProjectCategory =
  | "AI_ML"
  | "WEB_APP"
  | "AUTOMATION"
  | "BENCHMARK"
  | "MOBILE"
  | "FINTECH"
  | "EDTECH";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

// ─── PROJECT ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDesc?: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
  coverImage?: string | null;
  mobileImages: string[];
  webImages: string[];
  isMobilePrimary: boolean;
  techStack: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  readingTime?: number | null;
  featured: boolean;
  published: boolean;
  category: string;
  tags: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
  width?: number | null;
  height?: number | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
}

// ─── REVIEW ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  avatarUrl?: string | null;
  status: ReviewStatus;
  createdAt: Date;
}

// ─── BENCHMARK ───────────────────────────────────────────────────────────────

export interface Benchmark {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  category: string;
  kaggleUrl?: string | null;
  datasetUrl?: string | null;
  paperUrl?: string | null;
  metrics?: Record<string, unknown> | null;
  results?: Record<string, unknown> | null;
  coverImage?: string | null;
  charts: string[];
  tags: string[];
  techStack: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
}

// ─── AUTOMATION ──────────────────────────────────────────────────────────────

export interface AutomationEntry {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  longDesc?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  npmUrl?: string | null;
  telegramUrl?: string | null;
  coverImage?: string | null;
  screenshots: string[];
  logoUrl?: string | null;
  techStack: string[];
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
}

// ─── CHAT ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── STACK ───────────────────────────────────────────────────────────────────

export interface StackItem {
  name: string;
  icon?: string;
  level?: "expert" | "advanced" | "intermediate";
}

export interface StackCategory {
  title: string;
  emoji: string;
  items: StackItem[];
}

// ─── CONTACT FORM ────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ReviewFormData {
  name: string;
  email: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
}
