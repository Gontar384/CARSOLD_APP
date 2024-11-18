/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                global: ['sans-serif', 'Arial'],  //font set globally
            },
            colors: { //custom colors
                "lime": "#5efc03",
                "darkLime": "#5be410",
                "lowLime": "#6bfd17",
                "lowBlack": "#191a18",
                "coolRed": "#f20707",
                "coolLowRed": "#f5142e",
                "coolGreen": "#31d422"
            },
            screens: {  //custom screens
                "xs": "480px",
                "3xl": "1800px"
            },
            keyframes: {  //animations specific details
                spinBounce: {
                    '0%': {transform: "rotate(0deg) scale(1)"},
                    '50%': {transform: "rotate(180deg) scale(1.5)"},
                    '100%': {transform: "rotate(360deg) scale(1)"},
                },
                slideIn: {
                    '0%': {transform: "translateX(-100%)"},
                    '100%': {transform: "translateX(0)"},
                },
                slideOut: {
                    '0%': {transform: "translateX(0)"},
                    '100%': {transform: "translateX(100%)"},
                },
                slideUp: {
                    '0%': {transform: "translateY(100%)"},
                    '100%': {transform: "translateY(0)"},
                },
                slideDown: {
                    '0%': {transform: "translateY(0)"},
                    '100%': {transform: "translateY(100%)"},
                },
                flip: {
                    '0%': {transform: "rotate(0deg)"},
                    '100%': {transform: "rotate(180deg)"}
                },
                flipRev: {
                    '0%': {transform: "rotate(180deg)"},
                    '100%': {transform: "rotate(0deg)"}
                },
                disappear: {
                    '0%': {transform: "scale(1)", opacity: "1"},
                    '25%': {transform: "scale(1.25)", opacity: "0.75"},
                    '50%': {transform: "scale(1.5)", opacity: "0.5"},
                    '75%': {transform: "scale(1.75)", opacity: "0.25"},
                    '100%': {opacity: "0"},
                },
                disappearRev: {
                    '0%': {opacity: "0"},
                    '25%': {transform: "scale(1.75)", opacity: "0.25"},
                    '50%': {transform: "scale(1.5)", opacity: "0.5"},
                    '75%': {transform: "scale(1.25)", opacity: "0.75"},
                    '100%': {transform: "scale(1)", opacity: "1"},
                },
                pop: {
                    '0%': {transform: "scale(1)"},
                    '50%': {transform: "scale(1.5)"},
                    '100%': {transform: "scale(1)"}
                },
            },
            animation: {  //animations details
                spinBounce: 'spinBounce 1s linear infinite',
                slideIn: 'slideIn 0.3s ease-out forwards',
                slideOut: 'slideOut 0.3s ease-out forwards',
                slideUp: 'slideUp 0.3s ease-out forwards',
                slideDown: 'slideDown 0.3s ease-out forwards',
                flip: 'flip 0.3s ease-in-out forwards',
                flipRev: 'flipRev 0.3s ease-in-out forwards',
                disappear: 'disappear 0.1s ease-in forwards',
                disappearRev: 'disappearRev 0.1s ease-in-out forwards',
                pop: 'pop 0.3s ease-in-out forwards',
            },
        },
    },
    plugins: [],
}

