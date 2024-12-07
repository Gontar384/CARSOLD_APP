import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../CustomHooks/UseButton.ts";

interface MobileButtonProps {
    onClick: () => void;
    serial: number;
    icon: IconProp;
    label: string;
    count?: number;
}

const MobileButton: React.FC<MobileButtonProps> = ({serial, onClick, icon, label, count}) => {

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button className="flex flex-col items-center w-1/6 h-full p-1 relative"
                onClick={onClick} onTouchStart={() => handleTouchStart(serial)} onTouchEnd={() => handleTouchEnd(serial)}
                onMouseEnter={() => handleMouseEnter(serial)} onMouseLeave={() => handleMouseLeave(serial)}>
            <FontAwesomeIcon icon={icon} style={{ color: buttonColor[serial] }} className="text-xl xs:text-[22px]"/>
            {count && count > 0 ? (
                <p className="text-[9px] xs:text-[10px] top-[7px] text-white absolute">
                    {count}
                </p>
            ) : null}
            <p className={`text-[9px] xs:text-[10px] ${label.length > 12 ? "ml-[6px]" : ""}`}>{label}</p>
        </button>
    )
}

export default MobileButton