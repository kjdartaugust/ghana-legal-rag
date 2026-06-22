import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        navy: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          600: "#1a4a8a",
          700: "#0d3875",
          800: "#0a2f62",
          900: "#071e4a",
        },
      },
      boxShadow: {
        card:       "0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        "card-md":  "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        "card-lg":  "0 8px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
        message:    "0 1px 4px rgba(0,0,0,0.07)",
      },
      animation: {
        "fade-up":  "fadeUp 0.25s ease-out",
        "fade-in":  "fadeIn 0.2s ease-out",
        "dot-1":    "dotBounce 1.4s ease-in-out 0ms infinite",
        "dot-2":    "dotBounce 1.4s ease-in-out 200ms infinite",
        "dot-3":    "dotBounce 1.4s ease-in-out 400ms infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        dotBounce: {
          "0%, 80%, 100%": { transform: "translateY(0)",    opacity: "0.4" },
          "40%":           { transform: "translateY(-5px)", opacity: "1"   },
        },
      },
    },
  },
  plugins: [],
};

export default config;
