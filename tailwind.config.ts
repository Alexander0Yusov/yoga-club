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
        fs12: ["12px", "1.2"],
        fs16: ["16px", "1.2"],
        fs18: ["18px", "1.2"],
        fs20: ["20px", "1.2"],
        fs24: ["24px", "1.2"],
        xxl: ["32px", "1.2"],
        xxxl: ["40px", "1.2"],
        fs60: ["60px", "1.1"],
      },
      // COLORS
      colors: {
        localbrown: "#81453e",
        "brown-light": "#c57665",
        "brown-light-light": "#dfbeaf",
        lilac: "#bfb3b9",
        cadetblue: "#497274",
        "cadetblue-light": "#497274B2",
        "cadetblue-light-light": "#49727466",
      },
    },
  },
  plugins: [],
};
export default config;
