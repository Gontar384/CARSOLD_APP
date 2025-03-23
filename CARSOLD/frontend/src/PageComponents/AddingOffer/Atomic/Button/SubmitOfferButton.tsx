import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface SubmitOfferButtonProps {
    onClick: () => void;
    type: boolean;
}

const SubmitOfferButton: React.FC<SubmitOfferButtonProps> = ({ onClick, type }) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const {isMobile} = useUtil();

    const handleTouchButton = () => {
        setHovered(true);
        setTimeout(() => {
            setHovered(false);
        }, 300)
    };

    return (
        <button className="p-2 m:p-3 text-lg m:text-xl border-[3px] text-nowrap border-gray-300 rounded-lg bg-white relative"
                onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
                onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
                onTouchStart={isMobile ? handleTouchButton : undefined}
                onClick={onClick}>
            {`Submit & ${type ? "update" : "add"} offer`}
            {hovered &&
                <div className={`${type ? "w-[174px] m:w-[194px]" : "w-[150px] m:w-[168px]"} h-[2px] absolute bg-black animate-underline`}/>
            }
        </button>
    )
}

export default SubmitOfferButton