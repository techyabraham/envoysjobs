import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx,css}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",
        "deep-blue": "var(--deep-blue)",
        "deep-blue-dark": "var(--deep-blue-dark)",
        "deep-blue-light": "var(--deep-blue-light)",
        "emerald-green": "var(--emerald-green)",
        "emerald-green-dark": "var(--emerald-green-dark)",
        "emerald-green-light": "var(--emerald-green-light)",
        "soft-gold": "var(--soft-gold)",
        "soft-gold-dark": "var(--soft-gold-dark)",
        "soft-gold-light": "var(--soft-gold-light)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        "border-light": "var(--border-light)",
        "input-background": "var(--input-background)",
        "input-border": "var(--input-border)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "primary-hover": "var(--primary-hover)",
        success: "var(--success)",
        "success-foreground": "var(--success-foreground)",
        "success-hover": "var(--success-hover)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        "accent-hover": "var(--accent-hover)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)"
      }
    }
  },
  plugins: []
};

export default config;
