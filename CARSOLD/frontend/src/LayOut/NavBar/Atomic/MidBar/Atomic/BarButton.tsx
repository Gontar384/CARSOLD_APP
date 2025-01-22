import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface BarButtonProps {
    label: string;
    icon: IconProp;
    onClick: () => void;
    count?: number;
}

const BarButton: React.FC<BarButtonProps> = ({label, icon, onClick, count}) => {

    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <button
            className={`flex flex-row items-center justify-center h-14 gap-3 w-full relative ${buttonColor ? "bg-white" : "bg-lime"} relative`}
            onClick={onClick}
            onTouchStart={isMobile ? handleStart : undefined}
            onTouchEnd={isMobile ? handleEnd : undefined}
            onMouseEnter={!isMobile ? handleStart : undefined}
            onMouseLeave={!isMobile ? handleEnd : undefined}>
            {count && count > 0 ? (
                <p className="text-xl text-gray-400 absolute right-4">
                    {count}
                </p>
            ) : null}
            <span className="text-[22px] whitespace-nowrap">{label}</span>
            <FontAwesomeIcon icon={icon} className="text-2xl"/>
        </button>
    )
}

export default BarButton