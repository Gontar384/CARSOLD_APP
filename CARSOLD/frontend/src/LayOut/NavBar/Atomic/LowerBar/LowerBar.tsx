import React, {useEffect, useState} from "react";
import MobileButton from "./Atomic/MobileButton.tsx";
import {faAddressCard, faHeart, faMessage, faRightFromBracket, faSquarePlus, faUser} from "@fortawesome/free-solid-svg-icons";
import DarkModeButton from "./Atomic/DarkModeButton.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";


const LowerBar: React.FC = () => {

    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp" | null>(null);
    const [lowerBarActive, setLowerBarActive] = useState<boolean>(false);
    const {lowerBar, mobileWidth} = useUtil();
    const {isAuthenticated, handleLogout} = useAuth();
    const navigate = useNavigate();
    const {followed, messages} = useItems();

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
            <div
                className={`flex flex-row items-center justify-evenly h-14 fixed left-0 bottom-0 
                right-0 bg-lime shadow-top z-50 ${barAnimation}`}>
                <MobileButton onClick={() => navigate("/listingOffer")} icon={faSquarePlus} label="Add Offer"/>
                <MobileButton onClick={() => navigate("/details/followed")} icon={faHeart} label="Followed" count={followed}/>
                <MobileButton onClick={() => navigate("/details/messages")} icon={faMessage} label="Messages" count={messages}/>
                <MobileButton onClick={() => navigate("/details/myOffers")} icon={faUser} label={"Account"}/>
                {isAuthenticated ? (
                    <>
                        <DarkModeButton/>
                        <MobileButton onClick={handleLogout} icon={faRightFromBracket} label="Logout"/>
                    </>
                ) : (
                    <MobileButton onClick={() => navigate("/authenticate/login")} icon={faAddressCard} label="Login"/>
                )}
            </div>
        )
    }
}

export default LowerBar