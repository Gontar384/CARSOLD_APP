import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {faCircle as faRegularCircle} from '@fortawesome/free-regular-svg-icons';
import {useUtil} from "../../../../../GlobalProviders/UtilProvider.tsx";
import {useButton} from "../../../../../CustomHooks/UseButton.ts";

interface DarkModeButtonProps {
    serial: number;
}

const DarkModeButton: React.FC<DarkModeButtonProps> = ({ serial }) => {

    const { darkMode, toggleDarkMode, lowerBar, isMobile } = useUtil();

    const { buttonColor, handleStart, handleEnd } = useButton();

    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-fill" | "animate-empty" | null>(null);   //dark mode icons animations
    const [modeIcon1Animation, setModeIcon1Animation] = useState<"animate-fill" | "animate-empty" | null>(null);

    const handleDarkMode = () => {
        toggleDarkMode();
        setModeIconAnimation(!darkMode ? "animate-fill" : "animate-empty");
        setModeIcon1Animation(!darkMode ? "animate-empty" : "animate-fill");
    }   //handles dark mode and animates button

    useEffect(() => {
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
    }, [lowerBar]);   //resets animations

    return (
        <button
            className="flex flex-col items-center w-1/6 h-full p-1 relative"
            onClick={handleDarkMode}
            onTouchStart={isMobile ? () => handleStart(serial) : undefined}
            onTouchEnd={isMobile ? () => handleEnd(serial) : undefined}
            onMouseEnter={!isMobile ? () => handleStart(serial) : undefined}
            onMouseLeave={!isMobile ? () => handleEnd(serial) : undefined}>
            <FontAwesomeIcon icon={faMoon} style={{color: buttonColor[serial] ? "white" : "black"}}
                             className={`text-[13px] xs:text-[15px] top-[7px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
            <FontAwesomeIcon icon={faSun} style={{color: buttonColor[serial] ? "white" : "black"}}
                             className={`text-[12px] xs:text-[14px] top-[8px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
            <FontAwesomeIcon icon={faRegularCircle} style={{color: buttonColor[serial] ? "white" : "black"}} className="text-xl xs:text-[22px]"/>
            <p className="text-[9px] xs:text-[10px]">Mode</p>
        </button>
    )
}

export default DarkModeButton