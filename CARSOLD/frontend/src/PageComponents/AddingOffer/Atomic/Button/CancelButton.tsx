import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface CancelButtonProps {
    onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
    const [hovered, setHovered] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const {t, language} = useLanguage();

    const handleTouchButton = () => {
        setHovered(true);
        setTimeout(() => {
            setHovered(false);
        }, 300)
    };

    return (
        <button className="p-2 m:p-3 text-lg m:text-xl border-[3px] text-nowrap border-gray-300 rounded-lg bg-gray-200 relative"
            onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
            onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
            onTouchStart={isMobile ? handleTouchButton : undefined}
            onClick={onClick}>
            {t("offerForm108")}
            {hovered && <div className={`${language === "ENG" ? "w-[78%] m:w-[74%]" : "w-[75%] m:w-[71%]"} h-[2px] absolute bg-black animate-underline`}/>}
        </button>
    )
};

export default CancelButton;