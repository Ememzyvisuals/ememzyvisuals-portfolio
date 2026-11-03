import type { Config } from "tailwindcss";

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
        sans: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-display)', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // text sizes used by the contact section
      fontSize: {
        h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.012em", fontWeight: "700" }],
        lead: ["clamp(1.125rem, 1.03rem + 0.4vw, 1.375rem)", { lineHeight: "1.55" }],
        body: ["1.0625rem", { lineHeight: "1.65" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        caption: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.005em" }],
      },
      colors: {
        brand: { DEFAULT: "hsl(var(--brand))", foreground: "hsl(var(--brand-foreground))", soft: "hsl(var(--brand-soft))" },
        sun: { DEFAULT: "hsl(var(--sun))" },
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 24px 0 rgb(0 0 0 / 0.08)",
        "phone": "0 30px 80px -10px rgb(0 0 0 / 0.4)",
        "lift": "0 24px 60px -24px rgb(20 24 40 / 0.35)",
      },
      spacing: {
        "section": "5rem",
        "section-sm": "3.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
