import React from "react";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface ChoiceButtonProps {
    serial: number;
    label: "My Offers" | "Followed" | "Messages" | "Settings" | "Info";
    onClick: () => void;
    active: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ serial, label, onClick, active }) => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={'flex justify-center items-center py-[2px] px-[6px] w-[95px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] ' +
                'h-7 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px] rounded-sm bg-lowLime shadow whitespace-nowrap ' +
                ` text-${buttonColor[serial] ? "white" : "black"} text-base xs:text-lg lg:text-xl xl:text-[22px] 2xl:text-[26px] 3xl:text-3xl
                ${buttonColor[serial] ? "ring-[3px] xs:ring-4 2xl:ring-[5px] 3xl:ring-[6px] ring-lowLime/80 animate-gentle" : ""}
                ${active && !buttonColor[serial] ? "border-blue-500/30 border-2 xs:border-[3px] 2xl:border-4" : ""}`}
            onClick={onClick}
            onTouchStart={isMobile ? () => handleStart(serial) : undefined}
            onTouchEnd={isMobile ? () => handleEnd(serial) : undefined}
            onMouseEnter={!isMobile ? () => handleStart(serial) : undefined}
            onMouseLeave={!isMobile ? () => handleEnd(serial) : undefined}>
            {label}
        </button>
    )
}

export default ChoiceButton