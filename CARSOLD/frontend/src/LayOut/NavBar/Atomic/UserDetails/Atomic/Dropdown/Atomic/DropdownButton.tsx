import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";

interface DropdownButtonProps {
    label: string;
    onClick: () => void;
    count?: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, onClick, count }) => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={`flex items-center justify-center w-full h-9 ${buttonColor ? "bg-white" : "bg-lime"}`}
                onClick={onClick} onKeyDown={(event) => { if (event.key === "Enter") onClick() }}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            <span className="text-xl">{label}</span>
            {count && count > 0 ? <div className="relative ml-1">
                <FontAwesomeIcon icon={faCircle} style={{color: label === "Followed" ? "#370eeb" : "#ff0000"}}
                                 className="text-[22px]"/>
                <p className="inset-0 m-auto top-[5px] text-xs text-white absolute">
                    {count}</p>
            </div> : null}
        </button>
    )
}

export default DropdownButton