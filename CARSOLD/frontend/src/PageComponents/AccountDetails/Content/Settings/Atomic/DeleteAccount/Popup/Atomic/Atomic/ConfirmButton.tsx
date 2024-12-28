import React, {useState} from "react";
import {useUtil} from "../../../../../../../../../GlobalProviders/Util/useUtil.ts";

interface ConfirmButtonProps {
    label: "Yes" | "No" | "Submit";
    onClick: () => void;
    type: "choice" | "submit";
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({label, onClick, type}) => {

    const {isMobile} = useUtil();
    const [active, setActive] = useState<boolean>(false);

    return (
        <button className={`border border-black rounded-sm bg-lime
        ${type === "choice" ? "w-12 xs:w-[52px] lg:w-14 xl:w-16 2xl:w-[72px] 3xl:w-20" 
            : "w-16 xs:w-[72px] lg:w-20 xl:w-[90px] 2xl:w-[100px] 3xl:w-[108px]"}
             ${active ? "text-white" : ""}`}
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