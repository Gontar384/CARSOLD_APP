import React, {useState} from "react";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft} from "@fortawesome/free-solid-svg-icons";

interface DeleteAccountButtonProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({setPopup}) => {

    const {mobileWidth, isMobile} = useUtil();
    const [buttonAnimation, setButtonAnimation] = useState<"animate-swing" | null>(null);

    const handleActivateAnimation = () => {
        setButtonAnimation("animate-swing");
    }

    const handleDismissAnimation = () => {
        setTimeout(() => {
            setButtonAnimation(null);
        }, 700)
    }

    return (
        <div className={`flex flex-col-reverse w-full h-full
        ${!mobileWidth ? "items-center pb-3 lg:pb-5 xl:pb-6 2xl:pb-7 3xl:pb-8 sm:pr-2 lg:pr-0" : "items-end pr-5"}`}>
            <div className="flex flex-col items-center justify-center">
                <button className="flex"
                        onClick={() => setPopup(true)}
                        onTouchStart={isMobile ? handleActivateAnimation : undefined}
                        onTouchEnd={isMobile ? handleDismissAnimation : undefined}
                        onMouseEnter={!isMobile ? handleActivateAnimation : undefined}
                        onMouseLeave={!isMobile ? () => setButtonAnimation(null) : undefined}>
                    <FontAwesomeIcon icon={faDeleteLeft}
                                     className={`text-xl lg:text-[22px] xl:text-2xl 2xl:text-[26px] 3xl:text-[28px] ${buttonAnimation}`}
                                     style={{color: "red", transform: "rotate(-180deg)"}}/>
                </button>
                <p className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-[13px] 3xl:text-sm whitespace-nowrap">
                    Delete Account</p>
            </div>
        </div>
    )
}

export default DeleteAccountButton