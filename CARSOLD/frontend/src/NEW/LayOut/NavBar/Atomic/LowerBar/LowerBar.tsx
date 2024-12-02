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
import {useAuth} from "../../../../../GlobalProviders/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useItems} from "../../../../../GlobalProviders/ItemsProvider.tsx";
import {useUserDetails} from "../UserDetails/UserDetails.tsx";
import {useUtil} from "../../../../../GlobalProviders/UtilProvider.tsx";

//manages lower bar presence and dark mode function
export const useLowerBar = () => {

    const { lowerBar, setLowerBar, isWide, toggleDarkMode, darkMode } = useUtil();

    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp" | null>(null);

    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-fill" | "animate-empty" | null>(null);   //dark mode icons animations
    const [modeIcon1Animation, setModeIcon1Animation] = useState<"animate-fill" | "animate-empty" | null>(null);

    const [lowerBarActive, setLowerBarActive] = useState<boolean>(false);

    const handleLowerBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
        if (!lowerBar) {
            setLowerBar(true);
        } else {
            setLowerBar(false)
        }
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
    }   //activates and hides lower bar

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
    }, [lowerBar]);   //for delay to make lower bar more smooth (not relying on global state)

    useEffect(() => {
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
        setIconAnimation(null);
        setBarAnimation(null);
    }, [isWide]);   //resets animations

    const handleDarkMode = () => {
        toggleDarkMode();
        setModeIconAnimation(!darkMode ? "animate-fill" : "animate-empty");
        setModeIcon1Animation(!darkMode ? "animate-empty" : "animate-fill");
    }   //handles dark mode

    return { barAnimation, iconAnimation, modeIconAnimation, modeIcon1Animation, handleLowerBar, lowerBarActive, handleDarkMode }
}

const LowerBar: React.FC = () => {

    const { barAnimation, lowerBarActive } = useLowerBar();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { followed, messages } = useItems();
    const { userDetails, logout } = useUserDetails();

    return (
        <div
            className={` ${lowerBarActive ? "flex" : "hidden"} flex-row items-center justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 
            right-0 bg-lime shadow-top z-50 ${barAnimation}`}>
            <MobileButton onClick={() => navigate("/myAccount/myOffers")} icon={faSquarePlus} label="Add Offer" serial={1}/>
            <MobileButton onClick={() => navigate("/myAccount/followed")} icon={faHeart} label="Followed" count={followed} serial={2}/>
            <MobileButton onClick={() => navigate("/myAccount/messages")} icon={faMessage} label="Messages" count={messages} serial={3}/>
            <MobileButton onClick={() => navigate("/myAccount/myOffers")} icon={faUser} label={isAuthenticated ? userDetails : "Account"} serial={4}/>
            {isAuthenticated ? (
                <>
                    <DarkModeButton serial={5}/>
                    <MobileButton onClick={logout} icon={faRightFromBracket} label="Logout" serial={5}/>
                </>
            ) : (
                <MobileButton onClick={() => navigate("/authenticate/login")} icon={faAddressCard} label="Login" serial={6}/>
            )}
        </div>
    )
}

export default LowerBar