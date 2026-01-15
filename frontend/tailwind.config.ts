import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pm: {
          background: "var(--pm-background)",
          foreground: "var(--pm-foreground)",
          primary: "var(--pm-primary)",
          "primary-50": "var(--pm-primary-50)",
          "primary-600": "var(--pm-primary-600)",
          success: "var(--pm-success)",
          warning: "var(--pm-warning)",
          danger: "var(--pm-danger)",
          muted: "var(--pm-muted)",
          border: "var(--pm-border)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [animate],
};

export default config;

