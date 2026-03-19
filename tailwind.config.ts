import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // MEDIA QUERIES
    screens: {
      w480: "480px",
      w768: "768px",
      w1280: "1280px",
      w1440: "1440px",

      smOnly: { max: "767.98px" },
      mdOnly: { min: "768px", max: "1279.98px" },
      notXl: { max: "1279.98px" },
    },

    extend: {
      // FONTS
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        body: ["Mulish", "Trebuchet MS", "Segoe UI", "Arial", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"],
        inter: ["Inter", "Segoe UI", "Arial", "sans-serif"],
        mulish: ["Mulish", "Trebuchet MS", "Segoe UI", "Arial", "sans-serif"],
        philosopher: ["Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        "ui-sm": ["14px", { lineHeight: "1.3" }],
        "ui-md": ["16px", { lineHeight: "1.3" }],
        button: ["14px", { lineHeight: "1.3" }],
        "button-lg": ["16px", { lineHeight: "1.3" }],
        nav: ["14px", { lineHeight: "1.3" }],
        "nav-lg": ["16px", { lineHeight: "1.3" }],
        "body-sm": ["14px", { lineHeight: "1.3" }],
        "body-md": ["16px", { lineHeight: "1.3" }],
      },
      spacing: {
        "page-gutter": "20px",
        "section-gap": "20px",
        "control-gap": "20px",
        "control-padding-x": "20px",
        "control-padding-y": "10px",
      },
      borderRadius: {
        control: "10px",
        button: "20px",
        "button-lg": "25px",
      },
      // COLORS
      colors: {
        primary: "#81453e",
        "primary-foreground": "#ffffff",
        "brand-brown": "#81453e",
        "brand-green": "#497274",
        "brand-green-muted": "rgba(73,114,116,0.4)",
        "brand-green-strong": "rgba(73,114,116,0.7)",
        "accent-coral": "#c57665",
        "surface-sand": "#dfbeaf",
        "muted-lilac": "#bfb3b9",
        "muted-lilac-hover": "#bfb2b9",
        "button-border": "#81453e",
        "button-hover": "#bfb2b9",
        "button-active": "#c57665",
        "button-disabled": "#497274",
        heading: "#81453e",
        "subheading": "#497274",
        "secondary-text": "#c57665",
        "background-fill": "#bfb3b9",
        border: "#bfb3b9",
        "foreground-text": "#bfb3b9",
        warning: "#81453e",
        "yoga-accent": "#c57665",
        "yoga-accent-soft": "#dfbeaf",
        "yoga-bg": "#bfb3b9",
        "yoga-surface": "#dfbeaf",
        "yoga-border": "#bfb3b9",
      },
    },
  },
  plugins: [],
};
export default config;
