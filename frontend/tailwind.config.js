/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe",
          300: "#04046e", 400: "#60a5fa", 500: "#3b82f6",
          600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a",
        },
        dark: {
          50: "#f8fafc", 100: "#f1f5f9", 800: "#1e293b",
          850: "#172033", 900: "#0f172a", 950: "#080c14",
        },
        accent: {
          50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa",
          300: "#fdba74", 400: "#fb923c", 500: "#f97316",
          600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12",
        }
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 1.4s infinite",
        "pop": "pop 0.35s ease-out",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.45)" }, "100%": { transform: "scale(1)" } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: "translateX(-10px)", opacity: 0 }, to: { transform: "translateX(0)", opacity: 1 } },
      },
    },
  },
  plugins: [],
}
