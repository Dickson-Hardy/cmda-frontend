/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "sans-serif"],
      },
      colors: {
        primary: "#994279", // student
        primaryDark: "#6E2F50",
        onPrimary: "#F5ECF2",
        primaryContainer: "#2C1323",
        primaryTint: "#F7EAF2",
        primaryTint2: "#F4EEF2",
        onPrimaryContainer: "#E0C6D7",
        ink: "#333333",
        muted: "#666666",
        surface: "#F4F4F4",
        secondary: "#117E45", // doctor
        onSecondary: "#E7F2EC",
        secondaryContainer: "#03140B",
        onSecondaryContainer: "#B8D8C7",
        tertiary: "#0E05A1", // global member
        onTertiary: "#F3F2FA",
        tertiaryContainer: "#030014",
        onTertiaryContainer: "#DBD9F1",
        background: "#FDFBFC",
        error: "#FF4040",
        success: "#117E45",
        gray: { DEFAULT: "#999798", light: "#E9E8E9", dark: "#4D494C" },
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
