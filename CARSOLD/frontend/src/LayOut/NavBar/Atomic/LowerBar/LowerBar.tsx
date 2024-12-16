import React, {useEffect, useState} from "react";
import MobileButton from "./Atomic/MobileButton.tsx";
import {
    faAddressCard,
    faHeart,
    faMessage,
    faRightFromBracket,
    faSquarePlus,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import DarkModeButton from "./Atomic/DarkModeButton.tsx";
import {useNavigate} from "react-router-dom";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";


const LowerBar: React.FC = () => {

    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp" | null>(null);

    const [lowerBarActive, setLowerBarActive] = useState<boolean>(false);

    const { lowerBar, isWide } = useUtil();

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

        if (isWide) {
            setBarAnimation(null);
        }
    }, [lowerBar, isWide]);   //activates/deactivates lower bar and resets animation

    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const { followed, messages } = useItems();

    const { userDetails, logout, handleUsernameFetch } = useUserDetails();

    useEffect(() => {
        handleUsernameFetch().then();
    }, [handleUsernameFetch, isAuthenticated]);  //fetches username

    return (
        <div
            className={` ${lowerBarActive ? "flex" : "hidden"} flex-row items-center justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 
            right-0 bg-lime shadow-top z-50 ${barAnimation}`}>
            <MobileButton onClick={() => navigate("/home")} icon={faSquarePlus} label="Add Offer" serial={0}/>
            <MobileButton onClick={() => navigate("/details/followed")} icon={faHeart} label="Followed" count={followed} serial={1}/>
            <MobileButton onClick={() => navigate("/details/messages")} icon={faMessage} label="Messages" count={messages} serial={2}/>
            <MobileButton onClick={() => navigate("/details/myOffers")} icon={faUser} label={isAuthenticated ? userDetails : "Account"} serial={3}/>
            {isAuthenticated ? (
                <>
                    <DarkModeButton serial={5}/>
                    <MobileButton onClick={logout} icon={faRightFromBracket} label="Logout" serial={4}/>
                </>
            ) : (
                <MobileButton onClick={() => navigate("/authenticate/login")} icon={faAddressCard} label="Login" serial={5}/>
            )}
        </div>
    )
}

export default LowerBar