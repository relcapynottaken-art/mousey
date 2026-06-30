import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mousey dark premium palette
        ink: {
          950: "#06070b",
          900: "#0a0c12",
          850: "#0d1018",
          800: "#11141d",
          700: "#171b27",
          600: "#1f2433",
          500: "#2a3142",
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        accent: {
          DEFAULT: "#6366f1",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          glow: "#7c83ff",
        },
        cyber: {
          DEFAULT: "#22d3ee",
          400: "#38e0f5",
        },
        lime: {
          signal: "#a3e635",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.4), 0 0 40px -8px rgba(99,102,241,0.45)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -24px rgba(0,0,0,0.7)",
        float: "0 30px 80px -30px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-spot":
          "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-line": {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-line": "pulse-line 2.4s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        scan: "scan 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
