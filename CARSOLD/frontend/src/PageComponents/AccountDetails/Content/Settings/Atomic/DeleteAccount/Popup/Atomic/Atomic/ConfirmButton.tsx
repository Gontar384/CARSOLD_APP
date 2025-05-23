import React from "react";
import {useButton} from "../../../../../../../../../CustomHooks/useButton.ts";

interface ConfirmButtonProps {
    label: string;
    onClick: () => void;
    type: "choice" | "submit";
    isDisabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({label, onClick, type, isDisabled}) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`border border-black rounded bg-lime
        ${type === "choice" ? "w-16 m:w-[76px]" : "w-[100px] m:w-[120px]"} h-8 m:h-9
             ${buttonColor ? "text-white" : ""}`} disabled={isDisabled}
                onClick={onClick} {...bindHoverHandlers()}>
            {label}
        </button>
    )
}

export default ConfirmButton