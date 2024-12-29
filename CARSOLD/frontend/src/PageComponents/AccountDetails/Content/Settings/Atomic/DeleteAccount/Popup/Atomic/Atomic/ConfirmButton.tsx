import React, {useState} from "react";
import {useUtil} from "../../../../../../../../../GlobalProviders/Util/useUtil.ts";

interface ConfirmButtonProps {
    label: "Yes" | "No" | "Submit";
    onClick: () => void;
    type: "choice" | "submit";
    isDisabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({label, onClick, type, isDisabled}) => {

    const {isMobile} = useUtil();
    const [active, setActive] = useState<boolean>(false);


    return (
        <button className={`border border-black rounded-sm bg-lime
        ${type === "choice" ? "w-14 xs:w-16 lg:w-[72px] xl:w-20 2xl:w-[90px] 3xl:w-[100px]" 
            : "w-16 xs:w-[72px] lg:w-20 xl:w-[90px] 2xl:w-[100px] 3xl:w-[108px]"}
             ${active ? "text-white" : ""}`} disabled={isDisabled}
                onClick={onClick}
                onMouseEnter={!isMobile ? () => setActive(true) : undefined}
                onMouseLeave={!isMobile ? () => setActive(false) : undefined}
                onTouchStart={isMobile ? () => setActive(true) : undefined}
                onTouchEnd={isMobile ? () => setActive(false) : undefined}>
            {label}
        </button>
    )
}

export default ConfirmButton