import { type Config } from "tailwindcss";
import theme, { fontFamily, colors as defaultColors } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        themecolor1: "#222831",
        themeColor2: "#393E46",
        themeColor3: "#00ADB5",
        themeColor4: "#EEEEEE",
      }
    },
  },
  plugins: [],
} satisfies Config;
