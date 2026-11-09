/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        editorial: {
          bg: "#FAF9F5", // warm albaster stone
          dark: "#141312",
          muted: "#78716C",
          border: "#E7E5E4",
        }
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        editorial: ["'Instrument Serif'", "Georgia", "serif"],
        display: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      }
    },
  },
  plugins: [],
};
