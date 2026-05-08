/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 28px 80px rgba(37, 118, 190, 0.24)",
        soft: "0 18px 55px rgba(255, 255, 255, 0.22)",
      },
    },
  },
  plugins: [],
};
