import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun, faCircle as faRegularCircle} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../../GlobalProviders/UtilProvider.tsx";

interface DarkModeButtonProps {
    modeIconAnimation: "animate-fill" | "animate-empty" | null;
    modeIcon1Animation: "animate-fill" | "animate-empty" | null;
    handleDarkMode: () => void;
    handleTouchStart: () => void;
    handleTouchEnd: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    buttonColor: string;
}

const DarkModeButton: React.FC<DarkModeButtonProps> = ({ modeIconAnimation, modeIcon1Animation, handleDarkMode, handleTouchStart,
                                                           handleTouchEnd, handleMouseLeave, handleMouseEnter, buttonColor}) => {

    const {darkMode} = useUtil();

    return (
        <button
            className="flex flex-col items-center w-1/6 h-full p-1 relative"
            onClick={handleDarkMode}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <FontAwesomeIcon icon={faMoon} style={{color: buttonColor}}
                             className={`text-[13px] xs:text-[15px] top-[7px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
            <FontAwesomeIcon icon={faSun} style={{color: buttonColor}}
                             className={`text-[12px] xs:text-[14px] top-[8px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
            <FontAwesomeIcon icon={faRegularCircle} style={{color: buttonColor}} className="text-xl xs:text-[22px]"/>
            <p className="text-[9px] xs:text-[10px]">Mode</p>
        </button>
    )
}

export default DarkModeButton