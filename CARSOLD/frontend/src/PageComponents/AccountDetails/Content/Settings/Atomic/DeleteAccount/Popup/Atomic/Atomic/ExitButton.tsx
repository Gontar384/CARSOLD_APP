import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface ExitButtonProps {
    onClick: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({onClick}) => {
    return (
        <button className="absolute top-0 right-1 xs:top-[1px] xs:right-[5px] lg:top-[2px] lg:right-[6px]
        xl:top-[3px] xl:right-[7px] 2xl:top-[4px] 2xl:right-[8px] 3xl:top-[5px] 3xl:right-[9px]"
        onClick={onClick}>
            <FontAwesomeIcon className="text-2xl xs:text-[26px] lg:text-[28px] xl:text-[30px]
            2xl:text-[34px] 3xl:text-[38px]" icon={faXmark}/>
        </button>
    )
}

export default ExitButton