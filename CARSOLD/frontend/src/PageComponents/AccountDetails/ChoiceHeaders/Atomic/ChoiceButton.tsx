import React from "react";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface ChoiceButtonProps {
    label: "My Offers" | "Followed" | "Messages" | "Settings" | "Info";
    onClick: () => void;
    active: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ label, onClick, active }) => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={`flex justify-center items-center w-24 m:w-32 h-10 m:h-12 text-xl m:text-2xl
        shadow whitespace-nowrap text-${buttonColor ? "white" : "black"} rounded-sm bg-lowLime 
        ${buttonColor ? "ring-[3px] m:ring-4 ring-lowLime/80 animate-gentle" : ""}
        ${active && !buttonColor ? "border-blue-500/30 border-[3px] m:border-4" : ""}`}
            onClick={onClick}
            onTouchStart={isMobile ? handleStart : undefined}
            onTouchEnd={isMobile ? handleEnd : undefined}
            onMouseEnter={!isMobile ? handleStart : undefined}
            onMouseLeave={!isMobile ? handleEnd : undefined}>
            {label}
        </button>
    )
}

export default ChoiceButton