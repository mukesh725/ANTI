import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#25225E",
          dark: "#191742",
          soft: "#3A3680",
          tint: "#E9E8F0",
        },
        forest: {
          DEFAULT: "#173A2B",
          dark: "#0B241A",
        },
        sage: "#E8F0EA",
        gold: {
          DEFAULT: "#B98A34",
          soft: "#D4AF6A",
          tint: "#F7EDD8",
        },
        brick: {
          DEFAULT: "#8C2F2F",
          dark: "#5C1F1F",
          tint: "#F5E6E4",
        },
        theme: {
          DEFAULT: "var(--theme-primary)",
          dark: "var(--theme-dark)",
        },
        linen: "#F7F6F1",
        paper: "#FFFFFF",
        ink: "#1A1E1B",
        moss: "#767F76",
        hairline: "#EBE8DF",
        'sig-red': "#B3261E",
        'sig-green': "#2E7D32",
        
        // Deprecated (keep for backwards compatibility while migrating)
        alabaster: "#FFFFFF",
        charcoal: "#1A1E1B",
        background: "#F7F6F1",
        foreground: "#1A1E1B",
      },
      fontFamily: {
        serif: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
