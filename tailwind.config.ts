import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core cinematic palette
        noir: {
          DEFAULT: "#070707",
          900: "#0a0a0c",
          800: "#101014",
          700: "#16161c",
        },
        ink: "#050506",
        bone: "#f3efe7",
        ash: "#b6b1a7",
        // Rich gold accents
        gold: {
          DEFAULT: "#c9a25a",
          light: "#e7c987",
          deep: "#9c7836",
          glow: "#f0d49a",
        },
        // Navy atmospheric undertones
        navy: {
          DEFAULT: "#0c1422",
          deep: "#070d18",
          mist: "#16243d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.88", letterSpacing: "-0.04em" }],
        "12xl": ["clamp(4rem, 18vw, 18rem)", { lineHeight: "0.82", letterSpacing: "-0.045em" }],
      },
      letterSpacing: {
        cinematic: "0.42em",
        editorial: "-0.03em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
        cinematic: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      animation: {
        "grain": "grain 8s steps(10) infinite",
        "float-slow": "floatSlow 14s ease-in-out infinite",
        "shimmer": "shimmer 6s linear infinite",
      },
      keyframes: {
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "30%": { transform: "translate(3%,-15%)" },
          "50%": { transform: "translate(-8%,5%)" },
          "70%": { transform: "translate(6%,12%)" },
          "90%": { transform: "translate(-3%,8%)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-24px,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
