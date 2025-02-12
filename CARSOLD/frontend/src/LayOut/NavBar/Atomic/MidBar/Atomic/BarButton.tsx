import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {Link, useNavigate} from "react-router-dom";

interface BarButtonProps {
    label: string;
    icon: IconProp;
    path: string;
    count?: number;
}

const BarButton: React.FC<BarButtonProps> = ({label, icon, path, count}) => {

    const navigate = useNavigate();
    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <Link className={`flex flex-row items-center justify-center h-14 gap-3 w-full relative ${buttonColor ? "bg-white" : "bg-lime"} relative`}
            to={path} onKeyDown={(event) => { if (event.key === "Enter") navigate(path) }}
            onTouchStart={isMobile ? handleStart : undefined}
            onTouchEnd={isMobile ? handleEnd : undefined}
            onMouseEnter={!isMobile ? handleStart : undefined}
            onMouseLeave={!isMobile ? handleEnd : undefined}>
            <span className="text-[22px] whitespace-nowrap">{label}</span>
            <div className="relative">
                <FontAwesomeIcon icon={icon} className="text-2xl"/>
                {count && count > 0 ? (
                    <p className="absolute inset-0.5 text-center text-sm text-white">
                        {count}
                    </p>
                ) : null}
            </div>
        </Link>
    )
}

export default BarButton