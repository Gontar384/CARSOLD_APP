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
        <button className="absolute top-0 right-1 xs:top-[1px] xs:right-[5px] lg:top-[2px] lg:right-[6px]
        xl:top-[3px] xl:right-[7px] 2xl:top-[4px] 2xl:right-[8px] 3xl:top-[5px] 3xl:right-[9px]"
        onClick={onClick}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}>
            <FontAwesomeIcon className="text-2xl xs:text-[26px] lg:text-[28px] xl:text-[30px]
            2xl:text-[34px] 3xl:text-[38px]" icon={faXmark} style={{color: buttonColor ? "white" : "black"}}/>
        </button>
    )
}

export default ExitButton