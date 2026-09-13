import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090B",
          900: "#0C0E11",
          800: "#121418",
          700: "#1A1D22",
          600: "#24272E",
          500: "#31353D",
        },
        mist: {
          100: "#F5F6F8",
          200: "#E4E6EA",
          300: "#C8CBD3",
          400: "#9A9EAA",
          500: "#6E7280",
        },
        signal: {
          DEFAULT: "#6E56CF",
          soft: "#8E79E8",
          dim: "#4B3B99",
          amber: "#F5A524",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(110,86,207,0.18), transparent 60%)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
        marquee: "marquee 30s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
