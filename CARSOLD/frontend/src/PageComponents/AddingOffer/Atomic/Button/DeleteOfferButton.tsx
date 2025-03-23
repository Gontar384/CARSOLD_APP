import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ConfirmDeleteWindow from "./ConfirmDeleteWindow/ConfirmDeleteWindow.tsx";

interface DeleteOfferButtonProps {
    onClick: () => void;
}

const DeleteOfferButton: React.FC<DeleteOfferButtonProps> = ({onClick}) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const [decision, setDecision] = useState<boolean>(false);

    const handleTouchButton = () => {
        setHovered(true);
        setTimeout(() => setHovered(false), 300)
    };

    return (
        <>
            <button className="p-2 m:p-3 text-lg m:text-xl text-white text-nowrap border-[3px] border-gray-300
            rounded-lg bg-coolRed relative "
                    onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
                    onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
                    onTouchStart={isMobile ? handleTouchButton : undefined}
                    onClick={() => setDecision(true)}>
                Delete offer
                {hovered &&
                    <div className="w-[93px] m:w-[105px] h-[2px] absolute bg-white animate-underline"/>
                }
            </button>
            {decision &&
                <ConfirmDeleteWindow decision={decision} setDecision={setDecision} onClick={onClick}/>
            }
        </>
    )
};

export default DeleteOfferButton