import React, {useState} from "react";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft} from "@fortawesome/free-solid-svg-icons";

interface DeleteAccountButtonProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({setPopup}) => {

    const [buttonAnimation, setButtonAnimation] = useState<"animate-swing" | null>(null);
    const {isMobile} = useUtil();

    const handleActivateAnimation = () => {
        setButtonAnimation("animate-swing");
    }

    const handleDismissAnimation = () => {
        setTimeout(() => {
            setButtonAnimation(null);
        }, 700)
    }

    return (
        <div className="flex flex-col items-center justify-center mt-36 mb-[72px] m:mt-40 m:mb-20">
            <button className="flex"
                    onClick={() => setPopup(true)}
                    onTouchStart={isMobile ? handleActivateAnimation : undefined}
                    onTouchEnd={isMobile ? handleDismissAnimation : undefined}
                    onMouseEnter={!isMobile ? handleActivateAnimation : undefined}
                    onMouseLeave={!isMobile ? () => setButtonAnimation(null) : undefined}>
                <FontAwesomeIcon icon={faDeleteLeft}
                                 className={`text-3xl m:text-4xl ${buttonAnimation}`}
                                 style={{color: "red", transform: "rotate(-180deg)"}}/>
            </button>
            <p className="text-lg m:text-xl whitespace-nowrap">
                Delete Account</p>
        </div>
    )
}

export default DeleteAccountButton