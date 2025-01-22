import React, {SetStateAction, useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import Details from "../UserDetails/Atomic/Details.tsx";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import UserDetailsLoader from "../../../../SharedComponents/Additional/Loading/UserDetailsLoader.tsx";
import LoginButton from "../UserDetails/Atomic/LoginButton.tsx";
import BarButton from "./Atomic/BarButton.tsx";
import {
    faFileCirclePlus,
    faHeart,
    faMessage,
    faMoneyCheckDollar,
    faScrewdriverWrench,
    faLightbulb, faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import {faLightbulb as faLightBulbRegular} from "@fortawesome/free-regular-svg-icons";
import {useNavigate} from "react-router-dom";

interface MidBarProps {
    excludedButtonRef: React.RefObject<HTMLButtonElement>;
    setIconAnimation: React.Dispatch<SetStateAction<"animate-flip" | "animate-flipRev" | null>>;
}

const MidBar: React.FC<MidBarProps> = ({excludedButtonRef, setIconAnimation}) => {

    const [midBarActive, setMidBarActive] = useState<boolean>(false);
    const {midBar, midWidth} = useUtil();
    const [barAnimation, setBarAnimation] = useState<"animate-slideShow" | "animate-slideHide" | null>(null);

    useEffect(() => {
        if (midBar) {
            setMidBarActive(true);
            setBarAnimation("animate-slideShow")
        } else {
            setBarAnimation("animate-slideHide")
            const timeout = setTimeout(() => {
                setMidBarActive(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [midBar, midWidth]);   //activates/deactivates lower bar and resets animation

    const {isAuthenticated} = useAuth();

    const {userDetails, usernameFetched, handleUsernameFetch, profilePic, handleProfilePicFetch} = useUserDetails();
    const {profilePicChange, messages, followed} = useItems();
    const {setMidBar} = useUtil();

    //fetches username and profile pic
    useEffect(() => {
        handleUsernameFetch().then();
        handleProfilePicFetch().then();
    }, [handleProfilePicFetch, handleUsernameFetch, isAuthenticated, profilePicChange]);

    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside bar

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {

            if (excludedButtonRef.current && excludedButtonRef.current.contains(event.target as Node)) {
                return;
            }

            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setBarAnimation("animate-slideHide")
                setIconAnimation("animate-flipRev");
                setTimeout(() => {
                    setMidBarActive(false);
                    setMidBar(false);
                    setBarAnimation(null)
                }, 300)
            }
        };

        if (midBarActive) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.addEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [midBarActive]); //adds event listener for faster button deactivation

    const navigate = useNavigate();

    const {darkMode, toggleDarkMode} = useUtil();
    const {logout} = useUserDetails();

    if (midBarActive) {
        return (
            <div
                className={`flex flex-col items-center w-[230px] h-screen fixed top-11 bg-lime shadow ${barAnimation} z-50`}
                ref={componentRef}>
                <div className="flex justify-center w-full py-3 border-y border-black border-opacity-5">
                    {isAuthenticated ? (
                        usernameFetched ? (
                            <Details userDetails={userDetails} profilePic={profilePic}/>
                        ) : (
                            <UserDetailsLoader/>
                        )
                    ) : (
                        <LoginButton/>
                    )}
                </div>
                <div className="flex flex-col items-start w-full">
                    <BarButton onClick={() => navigate("")} icon={faFileCirclePlus} label="Add offer"/>
                    <BarButton onClick={() => navigate("/details/myOffers")} icon={faMoneyCheckDollar} label="My offers"/>
                    <BarButton onClick={() => navigate("/details/followed")} icon={faHeart} label="Followed" count={followed}/>
                    <BarButton onClick={() => navigate("/details/messages")} icon={faMessage} label="Messages" count={messages}/>
                    <BarButton onClick={() => navigate("/details/settings")} icon={faScrewdriverWrench} label="Settings"/>
                    {isAuthenticated &&
                        <>
                            <BarButton onClick={toggleDarkMode} icon={darkMode ? faLightbulb : faLightBulbRegular} label={`${!darkMode ? "Dark" : "Light"} mode`}/>
                            <BarButton onClick={logout} icon={faArrowRightFromBracket} label="Logout"/>
                        </>}
                </div>
            </div>
        )
    }
}

export default MidBar