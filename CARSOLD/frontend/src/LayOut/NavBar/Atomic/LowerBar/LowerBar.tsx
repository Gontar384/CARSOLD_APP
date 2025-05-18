import React, {useEffect, useState} from "react";
import MobileButton from "./Atomic/MobileButton.tsx";
import {faAddressCard, faHeart, faMessage, faRightFromBracket, faSquarePlus, faUser} from "@fortawesome/free-solid-svg-icons";
import DarkModeButton from "./Atomic/DarkModeButton.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useMessages} from "../../../../GlobalProviders/Messages/useMessages.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

const LowerBar: React.FC = () => {
    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp" | null>(null);
    const [lowerBarActive, setLowerBarActive] = useState<boolean>(false);
    const {lowerBar, mobileWidth} = useUtil();
    const {isAuthenticated, handleLogout} = useAuth();
    const navigate = useNavigate();
    const {unseenMessagesCount} = useMessages();
    const {t} = useLanguage();

    useEffect(() => {
        if (lowerBar) {
            setLowerBarActive(true);
            setBarAnimation("animate-slideUp")
        } else {
            setBarAnimation("animate-slideDown")
            const timeout = setTimeout(() => {
                setLowerBarActive(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [lowerBar, mobileWidth]);   //activates/deactivates lower bar and resets animation

    if (lowerBarActive) {
        return (
            <div className={`flex flex-row items-center justify-evenly h-14 fixed left-0 bottom-0 
                right-0 bg-lime shadow-top z-50 ${barAnimation} touch-none`}>
                <MobileButton onClick={() => navigate("/addingOffer")} icon={faSquarePlus} label={t("mobileButton1")}/>
                <MobileButton onClick={() => navigate("/details/followed")} icon={faHeart} label={t("mobileButton2")}/>
                <MobileButton onClick={() => navigate("/details/messages")} icon={faMessage} label={t("mobileButton3")} count={unseenMessagesCount}/>
                <MobileButton onClick={() => navigate("/details/myOffers")} icon={faUser} label={t("mobileButton4")}/>
                {isAuthenticated ? (
                    <>
                        <DarkModeButton/>
                        <MobileButton onClick={handleLogout} icon={faRightFromBracket} label={t("mobileButton6")}/>
                    </>
                ) : (
                    <MobileButton onClick={() => navigate("/authenticate/login")} icon={faAddressCard} label={t("mobileButton7")}/>
                )}
            </div>
        )
    }
}

export default LowerBar