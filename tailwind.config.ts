import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: { DEFAULT: "#e5e7eb" },
        primary: { 50: "#eff6ff", 500: "#3b82f6" },
        secondary: { DEFAULT: "#f9fafb" },
        tertiary: "#f3f4f6",
        "text-primary": "#111827",
        "text-secondary": "#6b7280",
        "text-tertiary": "#9ca3af",
        "text-link": "#2563eb",
        error: { 500: "#ef4444", 600: "#dc2626" },
      },
      spacing: {
        "18": "4.5rem",
        "sidebar": "17.5rem",
        "sidebar-collapsed": "4rem",
      },
      maxWidth: {
        "8xl": "1920px",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
