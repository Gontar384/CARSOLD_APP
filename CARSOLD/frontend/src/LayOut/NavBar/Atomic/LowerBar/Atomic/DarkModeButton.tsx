import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {faCircle as faRegularCircle} from '@fortawesome/free-regular-svg-icons';
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

const DarkModeButton: React.FC = () => {

    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-fill" | "animate-empty" | null>(null);   //dark mode icons animations
    const [modeIcon1Animation, setModeIcon1Animation] = useState<"animate-fill" | "animate-empty" | null>(null);
    const {darkMode, toggleDarkMode, lowerBar, isMobile} = useUtil();
    const {buttonColor, handleStart, handleEnd} = useButton();

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
            className="flex flex-col items-center w-1/6 h-full pt-[7px] relative"
            onClick={handleDarkMode}
            onTouchStart={isMobile ?handleStart : undefined}
            onTouchEnd={isMobile ? handleEnd : undefined}
            onMouseEnter={!isMobile ?handleStart : undefined}
            onMouseLeave={!isMobile ?handleEnd : undefined}>
            <FontAwesomeIcon icon={faMoon} style={{color: buttonColor ? "white" : "black"}}
                             className={`text-[20px] top-[11px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
            <FontAwesomeIcon icon={faSun} style={{color: buttonColor ? "white" : "black"}}
                             className={`text-[18px] top-[12px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
            <FontAwesomeIcon icon={faRegularCircle} style={{color: buttonColor ? "white" : "black"}} className="text-[28px]"/>
            <p className="text-xs">Mode</p>
        </button>
    )
}

export default DarkModeButton