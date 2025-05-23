import React from "react";
import {useButton} from "../../../../CustomHooks/useButton.ts";

interface SearchFiltersButtonProps {
    label: string;
    onClick: () => void;
    color: string;
}

const SearchFiltersButton: React.FC<SearchFiltersButtonProps> = ({label, onClick, color}) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`w-[115px] m:w-[130px] h-10 m:h-11 text-lg m:text-xl border-2 rounded-md
        bg-${color} ${buttonColor ? "border-gray-400" : "border-gray-300"}`}
                {...bindHoverHandlers()} onClick={onClick}>
            {label}
        </button>
    )
};

export default SearchFiltersButton