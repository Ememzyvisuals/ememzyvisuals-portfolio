import type { Config } from "tailwindcss";

// One type scale for the whole site. Headings use Bricolage Grotesque (font-display), everything else Outfit.
//   text-display  hero name only
//   text-h1       page titles
//   text-h2       section titles
//   text-h3       card and item titles
//   text-h4       small titles, form group titles
//   text-lead     intro paragraph under a title
//   text-body     running text
//   text-small    secondary text, meta, buttons
//   text-caption  labels, hints, legal
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-display)", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        display: ["clamp(3rem, 1.4rem + 5.6vw, 7.25rem)", { lineHeight: "0.94", letterSpacing: "-0.04em", fontWeight: "800" }],
        h1: ["clamp(2.5rem, 1.6rem + 3.6vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "800" }],
        h2: ["clamp(2rem, 1.4rem + 2.4vw, 3.75rem)", { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "800" }],
        h3: ["clamp(1.5rem, 1.25rem + 0.9vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.012em", fontWeight: "700" }],
        lead: ["clamp(1.125rem, 1.03rem + 0.4vw, 1.375rem)", { lineHeight: "1.55" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        caption: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.005em" }],
      },
      colors: {
        brand: { DEFAULT: "hsl(var(--brand))", foreground: "hsl(var(--brand-foreground))", soft: "hsl(var(--brand-soft))" },
        sun: { DEFAULT: "hsl(var(--sun))", ink: "hsl(var(--sun-ink))", soft: "hsl(var(--sun-soft))" },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      maxWidth: {
        page: "1520px",
        prose: "68ch",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 hsl(var(--shadow) / 0.06), 0 1px 1px 0 hsl(var(--shadow) / 0.04)",
        "card-hover": "0 12px 32px -12px hsl(var(--shadow) / 0.22)",
        lift: "0 24px 60px -24px hsl(var(--shadow) / 0.35)",
        phone: "0 30px 80px -10px rgb(0 0 0 / 0.4)",
      },
      spacing: {
        // vertical rhythm between sections, and the gap between a section title and its content
        section: "clamp(4.5rem, 2.5rem + 6vw, 9rem)",
        "section-sm": "clamp(3rem, 2rem + 3vw, 5rem)",
        stack: "clamp(2.5rem, 1.8rem + 2vw, 4rem)",
      },
    },
  },
  plugins: [],
};

export default config;
