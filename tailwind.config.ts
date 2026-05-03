import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic surface tokens (theme + mode aware via CSS vars) ────────
        bg: {
          canvas: "var(--bg-canvas)",
          surface: "var(--bg-surface)",
          "surface-raised": "var(--bg-surface-raised)",
          "surface-overlay": "var(--bg-surface-overlay)",
          muted: "var(--bg-muted)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
          "on-brand": "var(--text-on-brand)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)",
        },
        brand: {
          primary: "var(--brand-primary)",
          "primary-hover": "var(--brand-primary-hover)",
          "primary-active": "var(--brand-primary-active)",
          accent: "var(--brand-accent)",
          "accent-hover": "var(--brand-accent-hover)",
          warm: "var(--brand-warm)",
          earth: "var(--brand-earth)",
        },
        // ── Neutral grey scale (Figma) — no brown tint ──────────────────────
        grey: {
          50:  "var(--grey-50)",   // #e8e8e8
          100: "var(--grey-100)",  // #b8b7b7
          200: "var(--grey-200)",  // #959594
          300: "var(--grey-300)",  // #656464
          400: "var(--grey-400)",  // #474645
          500: "var(--grey-500)",  // #191817 — Brand Black
          600: "var(--grey-600)",  // #171615
          700: "var(--grey-700)",  // #121110
          800: "var(--grey-800)",  // #0e0d0d
          900: "var(--grey-900)",  // #0b0a0a
        },
        // ── Raw brand primitives (use sparingly — prefer semantic tokens) ────
        gold: {
          300: "var(--wahsh-gold-300)",
          400: "var(--wahsh-gold-400)",
          500: "var(--wahsh-gold-500)",
          600: "var(--wahsh-gold-600)",
          700: "var(--wahsh-gold-700)",
        },
        ink: {
          500: "var(--wahsh-ink-500)",
          600: "var(--wahsh-ink-600)",
          700: "var(--wahsh-ink-700)",
          800: "var(--wahsh-ink-800)",
          900: "var(--wahsh-ink-900)",
          950: "var(--wahsh-ink-950)",
        },
        status: {
          success: {
            DEFAULT: "rgb(var(--status-success) / <alpha-value>)",
            bg: "var(--status-success-bg)",
          },
          warning: {
            DEFAULT: "rgb(var(--status-warning) / <alpha-value>)",
            bg: "var(--status-warning-bg)",
          },
          danger: {
            DEFAULT: "rgb(var(--status-danger) / <alpha-value>)",
            bg: "var(--status-danger-bg)",
          },
          info: {
            DEFAULT: "rgb(var(--status-info) / <alpha-value>)",
            bg: "var(--status-info-bg)",
          },
        },
      },

      borderRadius: {
        none: "0",
        xs: "6px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
        "3xl": "48px",
        full: "9999px",
      },

      spacing: {
        "0.5": "2px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "20": "80px",
      },

      fontFamily: {
        sans: ["Thmanyah Sans", "system-ui", "sans-serif"],
        arabic: ["Thmanyah Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["15px", { lineHeight: "24px" }],
        md: ["16px", { lineHeight: "26px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "30px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "44px" }],
      },

      fontWeight: {
        light: "300",
        regular: "400",
        medium: "500",
        bold: "700",
        black: "900",
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "glow-brand": "var(--shadow-glow-brand)",
      },

      transitionDuration: {
        instant: "120ms",
        fast: "200ms",
        normal: "320ms",
        slow: "480ms",
        slower: "640ms",
      },

      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-6px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(6px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
      },

      animation: {
        "fade-in": "fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        shake: "shake 480ms cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
