import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../../CustomHooks/useButton.ts";

interface MobileButtonProps {
    onClick: () => void;
    icon: IconProp;
    label: string;
    count?: number;
}

const MobileButton: React.FC<MobileButtonProps> = ({onClick, icon, label, count}) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className="flex flex-col items-center w-1/6 h-full pt-[7px] m:pt-[9px] relative"
                onClick={onClick} {...bindHoverHandlers()}>
            <FontAwesomeIcon icon={icon} style={{color: buttonColor ? "white" : "black"}} className="text-[28px] m:text-[31px]"/>
            {count && count > 0 ? (
                <p className="text-xs m:text-sm top-2.5 text-white absolute">
                    {count}
                </p>
            ) : null}
            <p className="text-xs m:text-sm">{label}</p>
        </button>
    )
}

export default MobileButton