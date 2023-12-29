import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        inter: ["var(--font-inter)"],
        mulish: ["var(--font-mulish)"],
        philosopher: ["var(--font-philosopher)"],
      },
      fontSize: {
        base: ["16px", "1.2"],
        md: ["18px", "1.2"],
        lg: ["20px", "1.2"],
        xl: ["24px", "1.2"],
        xxl: ["32px", "1.2"],
        xxxl: ["40px", "1.2"],
      },
    },
  },
  plugins: [],
};
export default config;
