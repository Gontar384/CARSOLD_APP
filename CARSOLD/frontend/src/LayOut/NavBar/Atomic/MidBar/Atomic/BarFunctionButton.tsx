import React from "react";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface BarFunctionButtonProps {
    label: string;
    icon: IconProp;
    onClick: () => void;
}

const BarFunctionButton: React.FC<BarFunctionButtonProps> = ({ label, icon, onClick }) => {

    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`flex flex-row items-center justify-center h-14 gap-3 w-full relative ${buttonColor ? "bg-white" : "bg-lime"} relative`}
                onClick={onClick} onKeyDown={(event) => { if (event.key === "Enter") {event.preventDefault(); onClick()}}}
                {...bindHoverHandlers()}>
            <span className="text-[22px] whitespace-nowrap">{label}</span>
            <FontAwesomeIcon icon={icon} className="text-2xl"/>
        </button>
    )
}

export default BarFunctionButton