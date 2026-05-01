/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        videoBg: { 
          start: "#0f172a", 
          end: "#1e293b" 
        },
        videoCard: { 
          bg: "rgba(30, 41, 59, 0.7)", 
          border: "#334155" 
        },
        videoAccent: { 
          DEFAULT: "#3b82f6", 
          hover: "#60a5fa" 
        },
      },
    },
  },
  plugins: [],
}