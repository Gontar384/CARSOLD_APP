import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../../../../GlobalProviders/Util/useUtil.ts";

interface ExitButtonProps {
    onClick: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({onClick}) => {

    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <button className="absolute top-0 right-1"
        onClick={onClick}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}>
            <FontAwesomeIcon className="text-2xl m:text-3xl" icon={faXmark} style={{color: buttonColor ? "white" : "black"}}/>
        </button>
    )
}

export default ExitButton