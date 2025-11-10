import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "near-white": "#FAFAFA",
        "light-gray": "#E5E5E5",
        "mid-gray": "#999999",
        "dark-gray": "#333333",
        black: "#000000",
        error: "#DC2626",
        success: "#059669",
        focus: "#3B82F6",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      spacing: {
        "8": "8px",
        "16": "16px",
        "24": "24px",
        "48": "48px",
        "96": "96px",
      },
      screens: {
        mobile: { max: "767px" },
        tablet: { min: "768px", max: "1023px" },
        desktop: { min: "1024px" },
      },
    },
  },
  plugins: [],
};
export default config;
