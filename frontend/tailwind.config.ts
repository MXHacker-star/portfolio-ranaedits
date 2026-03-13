import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                "brand-red": "#FF1E26",
                "brand-dark": "#050505",
            },
            boxShadow: {
                neon: "0px 4px 15px rgba(255, 30, 38, 0.4)",
                soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
                "soft-hover": "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
            },
            backgroundImage: {
                "primary-gradient": "linear-gradient(to right, #FF1E26, #7D000F)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "var(--font-hind)", "sans-serif"],
                bengali: ["var(--font-hind)", "sans-serif"],
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-in-out",
                "slide-up": "slide-up 0.5s ease-out",
                marquee: "marquee 40s linear infinite",
                "marquee-logos": "marquee 30s linear infinite",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                marquee: {
                    "0%": { transform: "translate3d(0, 0, 0)" },
                    "100%": { transform: "translate3d(-50%, 0, 0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
