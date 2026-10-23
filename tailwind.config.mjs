/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Newsreader", "Charter", "Georgia", "Cambria", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50: "#f4f7f5",
          100: "#e6ede8",
          200: "#ccdcd2",
          300: "#a3c2b0",
          400: "#74a188",
          500: "#4f8266",
          600: "#3d6851",
          700: "#325442",
          800: "#2a4336",
          900: "#1e3027",
          950: "#0f1a15",
        },
        paper: {
          50: "#fdfdfc",
          100: "#fbfbfa",
          200: "#f5f5f3",
          300: "#ebebea",
        },
      },
    },
  },
  plugins: [],
};
