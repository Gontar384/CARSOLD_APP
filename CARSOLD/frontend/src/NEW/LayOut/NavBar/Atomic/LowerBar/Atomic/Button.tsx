import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface ButtonProps {
    onClick: () => void;
    icon: any;
    label: string;
    count?: number;
    handleTouchStart: () => void;
    handleTouchEnd: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    buttonColor: string;
}

const Button: React.FC<ButtonProps> = ({onClick, icon, label, count, handleTouchStart, handleTouchEnd,
                                           handleMouseLeave, handleMouseEnter, buttonColor}) => {

    return (
        <button className="flex flex-col items-center w-1/6 h-full p-1"
                onClick={onClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
            <FontAwesomeIcon icon={icon} style={{ color: buttonColor }} className="text-xl xs:text-[22px]"/>
            {count !== undefined && count > 0 && (
                <p className="text-[9px] xs:text-[10px] top-[7px] xs:top-[8px] text-white absolute">
                    {count}
                </p>
            )}
            <p className="text-[9px] xs:text-[10px]">{label}</p>
        </button>
    )
}

export default Button