import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB", green: "#22C55E", red: "#EF4444",
          orange: "#F59E0B", purple: "#7C3AED",
        },
        ink: { 900: "#111827", 700: "#374151", 500: "#6B7280" },
        surface: { DEFAULT: "#FFFFFF", muted: "#F5F6F8", soft: "#F8F9FB" },
        line: "#E5E7EB",
      },
      fontFamily: { sans: ["var(--font-heebo)", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 1px 3px rgba(17,24,39,0.06), 0 1px 2px rgba(17,24,39,0.04)",
        cardHover: "0 8px 24px rgba(17,24,39,0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
