/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
      colors: {
        primary: { light: "#F5ECF2", DEFAULT: "#994279", dark: "#2C1323" },
        onPrimaryContainer: "#E0C6D7",
        secondary: "#117E45",
        onSecondary: "#E7F2EC",
        secondaryContainer: "#03140B",
        onSecondaryContainer: "#B8D8C7",
        tertiary: "",
        onTertiary: "",
        tertiaryContainer: "",
        onTertiaryContainer: "",
        background: "#FDFBFC",
        error: "#FF4040",
        success: "#117E45",
      },
      animation: {
        slidein: "slidein 0.3s ease-in-out",
      },
      keyframes: {
        slidein: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: 0,
          },
          "100%": {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
