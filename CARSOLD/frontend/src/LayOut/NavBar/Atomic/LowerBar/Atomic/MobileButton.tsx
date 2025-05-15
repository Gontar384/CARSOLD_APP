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
        <button className="flex flex-col items-center w-1/6 h-full pt-[7px] relative"
                onClick={onClick} {...bindHoverHandlers()}>
            <FontAwesomeIcon icon={icon} style={{color: buttonColor ? "white" : "black"}} className="text-[28px]"/>
            {count && count > 0 ? (
                <p className="text-xs top-2.5 text-white absolute">
                    {count}
                </p>
            ) : null}
            <p className="text-xs">{label}</p>
        </button>
    )
}

export default MobileButton