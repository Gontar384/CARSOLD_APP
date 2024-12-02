import React from "react";
import {useButton} from "../../../../../LayOut/NavBar/Atomic/LowerBar/Atomic/MobileButton.tsx";

interface ButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    label: string;
    serial: number;
    isGoogle?: boolean;
}

const Button: React.FC<ButtonProps> = ({onClick, serial, isGoogle, label}) => {

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button className={`flex flex-row items-center justify-center w-full h-8 xs:h-9 2xl:h-11 3xl:h-[52px] 
        text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl shadow rounded-sm  
        ${buttonColor[serial] === "black" ? "bg-lime" : "bg-white"}`}
                onClick={onClick} onTouchStart={() => handleTouchStart(serial)} onTouchEnd={() => handleTouchEnd(serial)}
                onMouseEnter={() => handleMouseEnter(serial)} onMouseLeave={() => handleMouseLeave(serial)}>
            {isGoogle ? <img src="/google.png" alt='google'
                             className="w-5 h-5 xs:w-6 xs:h-6 2xl:w-8 2xl:h-8 3xl:w-9 3xl:h-9 mr-1"/> : null}
            {label}
        </button>
    )
}

export default Button