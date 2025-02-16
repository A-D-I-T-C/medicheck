/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                sidebar: {
                    background: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    accent: "hsl(var(--sidebar-accent))",
                }
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
            },
            fontFamily: {
                sans: ["geist", "sans-serif"],
                mono: ["geist-mono", "monospace"],
            },
        },
    },
    plugins: [],
}
