import React from "react";
import {useUtil} from "../../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useButton} from "../../../../../../../../../CustomHooks/useButton.ts";

interface ConfirmButtonProps {
    label: "Yes" | "No" | "Submit";
    onClick: () => void;
    type: "choice" | "submit";
    isDisabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({label, onClick, type, isDisabled}) => {

    const {isMobile} = useUtil();
    const { buttonColor, handleStart, handleEnd } = useButton();

    return (
        <button className={`border border-black rounded-sm bg-lime
        ${type === "choice" ? "w-14 xs:w-16 lg:w-[72px] xl:w-20 2xl:w-[90px] 3xl:w-[100px]" 
            : "w-16 xs:w-[72px] lg:w-20 xl:w-[90px] 2xl:w-[100px] 3xl:w-[108px]"}
             ${buttonColor ? "text-white" : ""}`} disabled={isDisabled}
                onClick={onClick}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}>
            {label}
        </button>
    )
}

export default ConfirmButton