import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface MobileButtonProps {
    onClick: () => void;
    icon: IconProp;
    label: string;
    count?: number;
}

const MobileButton: React.FC<MobileButtonProps> = ({onClick, icon, label, count}) => {

    const {isMobile} = useUtil();

    const { buttonColor, handleStart, handleEnd } = useButton();

    return (
        <button className="flex flex-col items-center w-1/6 h-full pt-[6px] relative"
                onClick={onClick}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            <FontAwesomeIcon icon={icon} style={{color: buttonColor ? "white" : "black"}} className="text-2xl"/>
            {count && count > 0 ? (
                <p className="text-[10px] top-[10px] text-white absolute">
                    {count}
                </p>
            ) : null}
            <p className="text-[10px]">{label}</p>
        </button>
    )
}

export default MobileButton