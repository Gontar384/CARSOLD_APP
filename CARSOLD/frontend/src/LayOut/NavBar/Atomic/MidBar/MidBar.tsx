import React, {SetStateAction, useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import Details from "../Info/UserInfo/Atomic/Details.tsx";
import {useUserUtil} from "../../../../CustomHooks/useUserUtil.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import LoginRegisterButton from "../Info/LoginRegisterButton/LoginRegisterButton.tsx";
import BarButton from "./Atomic/BarButton.tsx";
import {faFileCirclePlus, faHeart, faMessage, faMoneyCheckDollar, faScrewdriverWrench, faLightbulb, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faLightbulb as faLightBulbRegular} from "@fortawesome/free-regular-svg-icons";
import BarFunctionButton from "./Atomic/BarFunctionButton.tsx";
import UserInfoLoader from "../../../../Additional/Loading/UserInfoLoader.tsx";

interface MidBarProps {
    excludedButtonRef: React.RefObject<HTMLButtonElement | null>;
    setIconAnimation: React.Dispatch<SetStateAction<"animate-flip" | "animate-flipRev" | null>>;
}

const MidBar: React.FC<MidBarProps> = ({excludedButtonRef, setIconAnimation}) => {
    const [midBarActive, setMidBarActive] = useState<boolean>(false);
    const [barAnimation, setBarAnimation] = useState<"animate-slideShow" | "animate-slideHide" | null>(null);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside bar
    const {isAuthenticated, handleLogout} = useAuth();
    const {username, usernameFetched, handleFetchUsername, profilePic, handleFetchProfilePic} = useUserUtil();
    const {profilePicChange, messages} = useItems();
    const {setMidBar, darkMode, toggleDarkMode, midBar, midWidth} = useUtil();

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

    //fetches username and profile pic
    useEffect(() => {
        handleFetchUsername();
        handleFetchProfilePic();
    }, [handleFetchProfilePic, handleFetchUsername, isAuthenticated, profilePicChange]);

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
    }, [excludedButtonRef, midBarActive, setIconAnimation, setMidBar]); //adds event listener for faster button deactivation

    if (midBarActive) {
        return (
            <div
                className={`flex flex-col items-center w-[230px] h-screen fixed top-14 bg-lime shadow ${barAnimation} z-50`}
                ref={componentRef}>
                <div className="flex justify-center w-full py-3 border-y border-black border-opacity-5">
                    {isAuthenticated ? (
                        usernameFetched ? (
                            <Details username={username} profilePic={profilePic}/>
                        ) : (
                            <UserInfoLoader/>
                        )
                    ) : (
                        <LoginRegisterButton/>
                    )}
                </div>
                <div className="flex flex-col items-start w-full">
                    <BarButton label="Add Offer" icon={faFileCirclePlus} path={"/addingOffer"} />
                    <BarButton label="My offers" icon={faMoneyCheckDollar} path={"/details/myOffers"}/>
                    <BarButton label="Followed" icon={faHeart} path={"/details/followed"}/>
                    <BarButton label="Messages" icon={faMessage} path={"/details/messages"} count={messages}/>
                    <BarButton label="Settings" icon={faScrewdriverWrench} path={"/details/settings"} />
                    {isAuthenticated &&
                        <>
                            <BarFunctionButton label={`${!darkMode ? "Dark" : "Light"} mode`} icon={darkMode ? faLightbulb : faLightBulbRegular} onClick={toggleDarkMode}/>
                            <BarFunctionButton label="Logout" icon={faArrowRightFromBracket} onClick={handleLogout}/>
                        </>}
                </div>
            </div>
        )
    }
}

export default MidBar