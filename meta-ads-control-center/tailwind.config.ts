import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB", green: "#16A34A", red: "#EF4444",
          orange: "#F59E0B", purple: "#7C3AED",
        },
        ink: { 900: "#0B1220", 700: "#334155", 500: "#64748B" },
        surface: { DEFAULT: "#FFFFFF", muted: "#F4F6FA", soft: "#F7F9FC" },
        line: "#E7EAF0",
      },
      fontFamily: { sans: ["var(--font-heebo)", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.04)",
        cardHover: "0 8px 30px rgba(15,23,42,0.10)",
        lux: "0 10px 40px rgba(37,99,235,0.10)",
      },
      backgroundImage: {
        "brand-fade": "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
