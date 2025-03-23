import React from "react";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";

interface ConfirmDeleteButtonProps {
    onClick: () => void;
    option: "Yes" | "No";
}

const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({ onClick, option }) => {
    const {isMobile} = useUtil();
    const {buttonColor, handleStart, handleEnd} = useButton();

    return (
        <button className={`w-[72px] m:w-20 border-2 border-white shadow rounded bg-gray-800 ${buttonColor && "brightness-150"}`}
        onClick={onClick}
        onMouseEnter={!isMobile ? handleStart : undefined}
        onMouseLeave={!isMobile ? handleEnd : undefined}
        onTouchStart={isMobile ? handleStart : undefined}
        onTouchEnd={isMobile ? handleEnd : undefined}>
            {option}
        </button>
    )
};

export default ConfirmDeleteButton
