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
          DEFAULT: "rgb(var(--navy) / <alpha-value>)",
          dark: "rgb(var(--navy-dark) / <alpha-value>)",
          soft: "rgb(var(--navy-soft) / <alpha-value>)",
          tint: "rgb(var(--navy-tint) / <alpha-value>)",
        },
        forest: {
          DEFAULT: "rgb(var(--forest) / <alpha-value>)",
          dark: "rgb(var(--forest-dark) / <alpha-value>)",
        },
        sage: "rgb(var(--sage) / <alpha-value>)",
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          soft: "rgb(var(--gold-soft) / <alpha-value>)",
          tint: "rgb(var(--gold-tint) / <alpha-value>)",
        },
        brick: {
          DEFAULT: "rgb(var(--brick) / <alpha-value>)",
          dark: "rgb(var(--brick-dark) / <alpha-value>)",
          tint: "rgb(var(--brick-tint) / <alpha-value>)",
        },
        theme: {
          DEFAULT: "rgb(var(--theme-primary) / <alpha-value>)",
          dark: "rgb(var(--theme-dark) / <alpha-value>)",
        },
        linen: "rgb(var(--linen) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        moss: "rgb(var(--moss) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",
        'sig-red': "rgb(var(--sig-red) / <alpha-value>)",
        'sig-green': "rgb(var(--sig-green) / <alpha-value>)",
        
        // Deprecated (keep for backwards compatibility while migrating)
        alabaster: "rgb(var(--paper) / <alpha-value>)",
        charcoal: "rgb(var(--ink) / <alpha-value>)",
        background: "rgb(var(--linen) / <alpha-value>)",
        foreground: "rgb(var(--ink) / <alpha-value>)",
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
