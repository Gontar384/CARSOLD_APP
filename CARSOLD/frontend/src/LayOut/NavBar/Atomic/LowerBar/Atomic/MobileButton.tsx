import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../CustomHooks/UseButton.ts";
import {useUtil} from "../../../../../GlobalProviders/UtilProvider.tsx";

interface MobileButtonProps {
    onClick: () => void;
    serial: number;
    icon: IconProp;
    label: string;
    count?: number;
}

const MobileButton: React.FC<MobileButtonProps> = ({serial, onClick, icon, label, count}) => {

    const {isMobile} = useUtil();

    const { buttonColor, handleStart, handleEnd } = useButton();

    return (
        <button className="flex flex-col items-center w-1/6 h-full p-1 relative"
                onClick={onClick}
                onTouchStart={isMobile ? () => handleStart(serial) : undefined}
                onTouchEnd={isMobile ? () => handleEnd(serial) : undefined}
                onMouseEnter={!isMobile ? () => handleStart(serial) : undefined}
                onMouseLeave={!isMobile ? () => handleEnd(serial) : undefined}>
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