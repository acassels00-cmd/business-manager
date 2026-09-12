import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eafbf3",
          100: "#cdf3e0",
          200: "#9de6c4",
          300: "#63d2a4",
          400: "#33b985",
          500: "#159e6c",
          600: "#0d8058",
          700: "#0d6647",
          800: "#0f503a",
          900: "#0c4230",
          950: "#052a1f",
        },
        ink: {
          50: "#f9f9f7",
          100: "#f1f0ec",
          200: "#e1e0d9",
          300: "#c3c2b7",
          400: "#898781",
          500: "#5c5b56",
          600: "#52514e",
          700: "#3a3937",
          800: "#26251f",
          900: "#171712",
          950: "#0b0b0b",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
