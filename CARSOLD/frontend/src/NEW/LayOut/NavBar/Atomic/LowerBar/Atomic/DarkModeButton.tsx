import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {faCircle as faRegularCircle} from '@fortawesome/free-regular-svg-icons';
import {useUtil} from "../../../../../../GlobalProviders/UtilProvider.tsx";
import {useButton} from "./Button.tsx";
import {useLowerBar} from "../LowerBar.tsx";

interface DarkModeButtonProps {
    serial: number;
}

const DarkModeButton: React.FC<DarkModeButtonProps> = ({ serial }) => {

    const { handleDarkMode, modeIconAnimation, modeIcon1Animation } = useLowerBar();

    const { darkMode } = useUtil();

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button
            className="flex flex-col items-center w-1/6 h-full p-1 relative"
            onClick={handleDarkMode} onTouchStart={() => handleTouchStart(serial)} onTouchEnd={() => handleTouchEnd(serial)}
            onMouseEnter={() => handleMouseEnter(serial)} onMouseLeave={() => handleMouseLeave(serial)}>
            <FontAwesomeIcon icon={faMoon} style={{color: buttonColor[serial]}}
                             className={`text-[13px] xs:text-[15px] top-[7px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
            <FontAwesomeIcon icon={faSun} style={{color: buttonColor[serial]}}
                             className={`text-[12px] xs:text-[14px] top-[8px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
            <FontAwesomeIcon icon={faRegularCircle} style={{color: buttonColor[serial]}} className="text-xl xs:text-[22px]"/>
            <p className="text-[9px] xs:text-[10px]">Mode</p>
        </button>
    )
}

export default DarkModeButton