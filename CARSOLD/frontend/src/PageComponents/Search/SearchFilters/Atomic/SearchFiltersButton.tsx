import React from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useButton} from "../../../../CustomHooks/useButton.ts";

interface SearchFiltersButtonProps {
    label: "More filters" | "Reset filters" | "Search";
    onClick: () => void;
    color: string;
}

const SearchFiltersButton: React.FC<SearchFiltersButtonProps> = ({label, onClick, color}) => {
    const {isMobile} = useUtil();
    const {buttonColor, handleStart, handleEnd} = useButton();

    return (
        <button className={`w-[105px] m:w-[125px] h-10 m:h-11 text-lg m:text-xl border-2 rounded-md
        bg-${color} ${buttonColor ? "border-gray-400" : "border-gray-300"}`}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onClick={onClick}>
            {label}
        </button>
    )
};

export default SearchFiltersButton