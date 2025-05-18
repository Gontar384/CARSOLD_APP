import React from "react";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

interface ChoiceButtonProps {
    label: "My offers" | "Followed" | "Messages" | "Settings" | "Info" | "Admin";
    onClick: () => void;
    active: boolean;
    count?: number;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ label, onClick, active, count }) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`flex justify-center items-center w-24 m:w-32 h-10 m:h-12 text-xl m:text-2xl
        shadow whitespace-nowrap rounded-sm bg-lowLime relative
        ${buttonColor ? "text-white ring-[3px] m:ring-4 ring-lowLime/80 animate-gentle" : "text-black"}
        ${active && !buttonColor ? "border-blue-500/30 border-[3px] m:border-4" : ""}`}
            onClick={onClick} {...bindHoverHandlers()}>
            {label}
            {!active && count && count > 0 ?
                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                 className="absolute -top-[13px] m:-top-4 text-[8px] m:text-[10px]"/> : null}
        </button>
    )
}

export default ChoiceButton