import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        primary: "#059669",
        alert: "#ea580c"
      },
      fontFamily: { sans: ["Inter", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;