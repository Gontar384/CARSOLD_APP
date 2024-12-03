import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../CustomHooks/UseButton.ts";

interface DropdownButtonProps {
    label: string;
    onClick: () => void;
    count?: number;
    serial: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, onClick, count, serial }) => {

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button className={'flex items-center justify-center w-full h-[22px] lg:h-[28px] xl:h-[32px] 2xl:h-[39px] 3xl:h-[47px] ' +
            `text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] ${buttonColor[serial] === "black" ? "bg-lime" : "bg-white"} `}
                onClick={onClick} onKeyDown={(event) => { if (event.key === "Enter") onClick() }}
                onTouchStart={() => handleTouchStart(serial)} onTouchEnd={() => handleTouchEnd(serial)}
                onMouseEnter={() => handleMouseEnter(serial)} onMouseLeave={() => handleMouseLeave(serial)}>
            <span>{label}</span>
            {count && count > 0 ? <div className="relative mt-[1px] ml-[2px] xl:ml-1 3xl:ml-[6px]">
                <FontAwesomeIcon icon={faCircle} style={{color: label === "Followed" ? "#370eeb" : "#ff0000"}}
                                 className="text-[13px] lg:text-[18px] xl:text-[21px] 2xl:text-[25px] 3xl:text-[30px]"/>
                <p className="inset-0 m-auto sm:top-[2px] xl:top-[1px] 2xl:top-[3px] 3xl:top-[5px] text-[8px] lg:text-[11px] xl:text-[13px]
                2xl:text-[16px] 3xl:text-[20px] text-white absolute">{count}</p>
            </div> : null}
        </button>
    )
}

export default DropdownButton