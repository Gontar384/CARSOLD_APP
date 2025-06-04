import React, {useState} from "react";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

interface DeleteAccountButtonProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({setPopup}) => {
    const [buttonAnimation, setButtonAnimation] = useState<"animate-swing" | null>(null);
    const {isMobile} = useUtil();
    const {t} = useLanguage();

    const handleActivateAnimation = () => {
        setButtonAnimation("animate-swing");
    }

    const handleDismissAnimation = () => {
        setTimeout(() => setButtonAnimation(null), 700);
    }

    return (
        <button className="flex flex-col items-center justify-center mt-36 m:mt-40 mb-20 m:mb-24 gap-1 m:gap-2"
                onClick={() => setPopup(true)}
                onTouchStart={isMobile ? handleActivateAnimation : undefined}
                onTouchEnd={isMobile ? handleDismissAnimation : undefined}
                onMouseEnter={!isMobile ? handleActivateAnimation : undefined}
                onMouseLeave={!isMobile ? () => setButtonAnimation(null) : undefined}>
            <p className="text-lg m:text-xl whitespace-nowrap">{t("deleteAccount1")}</p>
            <FontAwesomeIcon icon={faDeleteLeft} className={`text-3xl m:text-4xl ${buttonAnimation}`}
                             style={{color: "red", transform: "rotate(-180deg)"}}/>
        </button>
    )
}

export default DeleteAccountButton