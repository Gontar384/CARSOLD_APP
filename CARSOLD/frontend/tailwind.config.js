/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "lime": "#5efc03",
                "darkLime": "#5be410",
                "lowLime": "#6bfd17",
                "lowBlack": "#191a18",
            },
            screens: {
                "sm1": "480px",
                "sm2": "380px",
                "sm3": "340px"
            },
            keyframes: {
                spinBounce: {
                    '0%': {transform: "rotate(0deg) scale(1)"},
                    '50%': {transform: "rotate(180deg) scale(1.5)"},
                    '100%': {transform: "rotate(360deg) scale(1)"},
                },
            },
            animation: {
                spinBounce: 'spinBounce 1s linear infinite'
            },
        },
    },
    plugins: [],
}

