/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                global: ['sans-serif', 'Arial'],
            },
            colors: {
                "lime": "#caf04f",
                "darkLime": "#82ad00",
                "lowLime": "#bedb65",
                "lowBlack": "#191a18",
                "coolRed": "#fa7a7a",
                "coolGreen": "#7cff70",
                "coolYellow": "#d3d61c"
            },
            screens: {
                "m": "450px"
            },
            keyframes: {
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
                    '50%': {transform: "scale(1.3)"},
                    '100%': {transform: "scale(1)"}
                },
                fill: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'},
                },
                empty: {
                    '0%': {opacity: '1'},
                    '100%': {opacity: '0'},
                },
                dash: {
                    '0%': {strokeDasharray: '1, 150', strokeDashoffset: '0'},
                    '50%': {strokeDasharray: '90, 150', strokeDashoffset: '-35'},
                    '100%': {strokeDasharray: '90, 150', strokeDashoffset: '-125'},
                },
                grow: {
                    "0%": {width: "0%"},
                    "75%": {width: "75%"},
                    "100%": {width: "100%"},
                },
                wave: {
                    '0%': { transform: 'scale(0)', opacity: '0.3' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                },
                shock: {
                    '0%': {transform: "scale(1) rotate(90deg)"},
                    '50%': {transform: "scale(1.3)"},
                    '100%': {transform: "scale(1) rotate(180deg)"},
                },
                pulse1: {
                    '0%': {opacity: "0"},
                    '25%': {opacity: "0"},
                    '50%': {opacity: "1", transform: "scale(1.2)"},
                    '75%': {opacity: "0"},
                    '100%': {opacity: "0"}
                },
                slideInDiagonal: {
                    '0%': {transform: "translate(-100%, -100%)"},
                    '100%': {transform: "translate(0, 0)"},
                },
                gentle: {
                    '0%': {transform: "scale(1)"},
                    '100%': {transform: "scale(1.05)"},
                },
                slideRight: {
                    '0%': {transform: "translateX(-110%)"},
                    '100%': {transform: "translateX(0)"}
                },
                slideLeft: {
                    '0%': {transform: "translateX(0)"},
                    '100%': {transform: "translateX(-110%)"}
                },
                slideOn1: {
                    '0%': {transform: "translateX(0)"},
                    '100%': {transform: "translateX(106%)"}
                },
                slideOff1: {
                    '0%': {transform: "translateX(106%)"},
                    '100%': {transform: "translateX(0)"}
                },
                slideOn2: {
                    '0%': {transform: "translateX(-106%)"},
                    '100%': {transform: "translateX(0)"}
                },
                slideOff2: {
                    '0%': {transform: "translateX(0)"},
                    '100%': {transform: "translateX(-106%)"}
                },
                swing: {
                    '0%': {transform: "rotate(180deg)"},
                    '50%': {transform: "rotate(90deg)"},
                    '100%': {transform: "rotate(180deg)"},
                },
                slideShow: {
                    '0%': {transform: "translateX(-100%)"},
                    '100%': {transform: "translateX(0)"}
                },
                slideHide: {
                    '0%': {transform: "translateX(0)"},
                    '100%': {transform: "translateX(-100%)"}
                },
                unroll: {
                    '0%': {transform: "scaleY(0)", transformOrigin: "top"},
                    '50%': {transform: "scaleY(0.5)", transformOrigin: "top"},
                    '100%': {transform: "scaleY(1)", transformOrigin: "top"}
                },
                unrollRev: {
                    '0%': {transform: "scaleY(1)", transformOrigin: "top"},
                    '50%': {transform: "scaleY(0.5)", transformOrigin: "top"},
                    '100%': {transform: "scaleY(0)", transformOrigin: "top"}
                },
                spin: {
                    '0%': {transform: "rotate(0deg)"},
                    '100%': {transform: "rotate(360deg)"},
                },
                underline: {
                    '0%': {transform: "scaleX(0)", transformOrigin: "top"},
                    '50%': {transform: "scaleX(0.5)", transformOrigin: "top"},
                    '100%': {transform: "scaleX(1)", transformOrigin: "top"}
                },
                slideDownShow: {
                    '0%': {transform: "translateY(-100%)"},
                    '100%': {transform: "translateY(0)"},
                },
                slideUpShow: {
                    '0%': {transform: "translateY(0)"},
                    '100%': {transform: "translateY(-100%)"},
                },
                appearSlow: {
                    '0%': {transform: "translateX(200%)"},
                    '100%': {transform: "translateX(0)"},
                },
                appearFast: {
                    '0%': {transform: "translateX(200%)"},
                    '100%': {transform: "translateX(0)"},
                },
                appearSlowRev: {
                    '0%': {transform: "translateX(-200%)"},
                    '100%': {transform: "translateX(0)"},
                },
                appearFastRev: {
                    '0%': {transform: "translateX(-200%)"},
                    '100%': {transform: "translateX(0)"},
                },
                slideUpAppear: {
                    '0%': {transform: "translateY(100%)"},
                    '100%': {transform: "translateY(0)"},
                },
                slideDownDisappear: {
                    '0%': {transform: "translateY(0)"},
                    '100%': {transform: "translateY(100%)"},
                },
                pulseBar: {
                    '0%': {transform: "scaleY(1)", opacity: "0.7"},
                    '50%': {transform: "scaleY(2)", opacity: "1"},
                    '100%': {transform: "scaleY(1)", opacity: "0.7"},
                },
            },
            animation: {
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
                fill: 'fill 0.5s linear forwards',
                empty: 'empty 0.5s linear forwards',
                dash: 'dash 1.6s ease-in-out infinite',
                grow: 'grow 2s ease-out forwards',
                wave: 'wave 0.6s linear',
                shock: 'shock 0.3s ease-in-out forwards',
                pulse1: 'pulse1 5s ease-in-out infinite',
                slideInDiagonal: 'slideInDiagonal 0.3s ease-out forwards',
                gentle: 'gentle 0.3s ease-in-out forwards',
                slideRight: 'slideRight 0.3s ease-out forwards',
                slideLeft: 'slideLeft 0.3s ease-out forwards',
                slideOn1: 'slideOn1 0.3s ease-out forwards',
                slideOn2: 'slideOn2 0.3s ease-out forwards',
                slideOff1: 'slideOff1 0.3s ease-out forwards',
                slideOff2: 'slideOff2 0.3s ease-out forwards',
                swing: 'swing 0.7s ease-in-out forwards',
                slideShow: 'slideShow 0.3s ease-out forwards',
                slideHide: 'slideHide 0.3s ease-out forwards',
                unroll: 'unroll 0.2s linear forwards',
                unrollRev: 'unrollRev 0.2s linear forwards',
                spin: 'spin 0.2s ease-in-out forwards',
                underline: 'underline 0.2s linear forwards',
                slideDownShow: 'slideDownShow 0.2s ease-in-out forwards',
                slideUpShow: 'slideUpShow 0.2s ease-in-out forwards',
                appearSlow: 'appearSlow 1s ease-in-out forwards',
                appearFast: 'appearFast 0.5s ease-in-out forwards',
                appearSlowRev: 'appearSlowRev 1s ease-in-out forwards',
                appearFastRev: 'appearFastRev 0.5s ease-in-out forwards',
                slideUpAppear: 'slideUpAppear 0.3s ease-in-out forwards',
                slideDownDisappear: 'slideDownDisappear 0.3s ease-in-out forwards',
                pulseBar: 'pulseBar 1.2s ease-in-out infinite'
            },
        },
    },
    plugins: [
        function ({ addBase }) {
            addBase({
                'input[type="file"]::file-selector-button': {
                    display: 'none', //hides "Choose File" button
                },
            });
        },],
}

