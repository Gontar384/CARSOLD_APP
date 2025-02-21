import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface SubmitOfferButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const SubmitOfferButton: React.FC<SubmitOfferButtonProps> = ({ onClick, disabled }) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const {isMobile} = useUtil();

    const handleTouchButton = () => {
        setHovered(true);
        setTimeout(() => {
            setHovered(false);
        }, 300)
    };

    return (
        <button className="p-2 m:p-3 text-lg m:text-xl border-[3px] border-gray-300 rounded-lg bg-white relative"
                onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
                onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
                onTouchStart={isMobile ? handleTouchButton : undefined}
                onClick={onClick} disabled={disabled}>
            Submit & add offer
            {hovered &&
                <div className={'w-[150px] m:w-[168px] h-[2px] absolute bg-black animate-underline'}/>
            }
        </button>
    )
}

export default SubmitOfferButton