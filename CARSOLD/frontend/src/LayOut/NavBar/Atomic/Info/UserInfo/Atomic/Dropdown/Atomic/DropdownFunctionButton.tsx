import React from "react";
import {useButton} from "../../../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";

interface DropdownFunctionButtonProps {
    label: string;
    onClick: () => void;
}

const DropdownFunctionButton: React.FC<DropdownFunctionButtonProps> = ({ label, onClick }) => {

    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={`flex items-center justify-center w-full h-9 ${buttonColor ? "bg-white" : "bg-lime"}`}
                onClick={onClick} onKeyDown={(event) => { if (event.key === "Enter") {event.preventDefault(); onClick()}}}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            <span className="text-xl">{label}</span>
        </button>
    )
}

export default DropdownFunctionButton