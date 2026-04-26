/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#0a0a0a",
        "medium-blue": "#171717",
        "light-blue": "#404040",
        "accent-blue": "#000000",
        "secondary-bg": "#fafafa",
        "text-primary": "#0a0a0a",
        "text-secondary": "#737373",
        "border-custom": "#e5e5e5",
        "red-cta": "#dc2626",
      },
      fontSize: {
        xs: "0.875rem",
        sm: "1rem",
        base: "1.125rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "1.875rem",
        "3xl": "2.25rem",
      },
      borderRadius: {
        "3xl": "1rem",
        "4xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
