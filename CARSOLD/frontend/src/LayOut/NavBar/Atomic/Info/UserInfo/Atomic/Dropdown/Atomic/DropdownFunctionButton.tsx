import React from "react";
import {useButton} from "../../../../../../../../CustomHooks/useButton.ts";

interface DropdownFunctionButtonProps {
    label: string;
    onClick: () => void;
}

const DropdownFunctionButton: React.FC<DropdownFunctionButtonProps> = ({ label, onClick }) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`flex items-center justify-center w-full h-9 ${buttonColor ? "bg-white" : "bg-lime"}`}
                onClick={onClick} onKeyDown={(event) => { if (event.key === "Enter") {event.preventDefault(); onClick()}}}
                {...bindHoverHandlers()}>
            <span className="text-xl">{label}</span>
        </button>
    )
}

export default DropdownFunctionButton