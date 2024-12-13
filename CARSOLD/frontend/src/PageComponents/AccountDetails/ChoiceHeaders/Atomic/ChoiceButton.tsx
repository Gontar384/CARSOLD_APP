import React from "react";
import {useButton} from "../../../../CustomHooks/UseButton.ts";
import {useUtil} from "../../../../GlobalProviders/UtilProvider.tsx";

interface ChoiceButtonProps {
    serial: number;
    label: "My Offers" | "Followed" | "Messages" | "Settings" | "Info";
    onClick: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ serial, label, onClick }) => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button
            className={'py-[2px] px-[6px] w-[95px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] ' +
                'h-7 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px] rounded-sm bg-lowLime shadow whitespace-nowrap ' +
                ` text-${buttonColor[serial]} ${buttonColor[serial] === "black" ? "" : "ring-4 ring-lime/80"} text-base xs:text-lg 
                lg:text-xl xl:text-[22px] 2xl:text-[26px] 3xl:text-3xl`}
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