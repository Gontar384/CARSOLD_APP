import React, {SetStateAction, useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import Details from "../Info/UserInfo/Atomic/Details.tsx";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import LoginRegisterButton from "../Info/LoginRegisterButton/LoginRegisterButton.tsx";
import BarButton from "./Atomic/BarButton.tsx";
import {faFileCirclePlus, faHeart, faMessage, faMoneyCheckDollar, faScrewdriverWrench, faLightbulb, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faLightbulb as faLightBulbRegular} from "@fortawesome/free-regular-svg-icons";
import BarFunctionButton from "./Atomic/BarFunctionButton.tsx";
import UserInfoLoader from "../../../../Additional/Loading/UserInfoLoader.tsx";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useMessages} from "../../../../GlobalProviders/Messages/useMessages.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface MidBarProps {
    excludedButtonRef: React.RefObject<HTMLButtonElement | null>;
    setIconAnimation: React.Dispatch<SetStateAction<"animate-flip" | "animate-flipRev" | null>>;
}

const MidBar: React.FC<MidBarProps> = ({excludedButtonRef, setIconAnimation}) => {
    const [midBarActive, setMidBarActive] = useState<boolean>(false);
    const [barAnimation, setBarAnimation] = useState<"animate-slideShow" | "animate-slideHide" | null>(null);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside bar
    const {isAuthenticated, handleLogout} = useAuth();
    const {unseenMessagesCount} = useMessages();
    const {usernameFetched, profilePicFetched} = useUserUtil();
    const {setMidBar, darkMode, toggleDarkMode, midBar, midWidth} = useUtil();
    const {t} = useLanguage();

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
    }, [midBar, midWidth]);   //activates/deactivates bar and resets animation

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
                }, 300);
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
            <nav className={`flex flex-col items-center w-[270px] h-screen fixed top-14 bg-lime shadow ${barAnimation} z-50
            overflow-auto overscroll-contain`}
                ref={componentRef}>
                <div className="flex justify-center w-full py-3 border-y border-black border-opacity-5">
                    {isAuthenticated ? (
                        usernameFetched && profilePicFetched ? (
                            <Details letClick={true}/>
                        ) : (
                            <UserInfoLoader/>
                        )
                    ) : (
                        <LoginRegisterButton/>
                    )}
                </div>
                <div className="flex flex-col items-start w-full pb-14">
                    <BarButton label={t("dropdownButton1")} icon={faMoneyCheckDollar} path={"/details/myOffers"}/>
                    <BarButton label={t("dropdownButton2")} icon={faHeart} path={"/details/followed"}/>
                    <BarButton label={t("dropdownButton3")} icon={faMessage} path={"/details/messages"} count={unseenMessagesCount}/>
                    <BarButton label={t("dropdownButton4")} icon={faScrewdriverWrench} path={"/details/settings"} />
                    <BarButton label={t("dropdownButton8")} icon={faFileCirclePlus} path={"/addingOffer"}/>
                    {isAuthenticated &&
                        <>
                            <BarFunctionButton label={`${!darkMode ? t("dropdownButton6") : t("dropdownButton5")}`} icon={darkMode ? faLightbulb : faLightBulbRegular} onClick={toggleDarkMode}/>
                            <BarFunctionButton label={t("dropdownButton7")} icon={faArrowRightFromBracket} onClick={handleLogout}/>
                        </>}
                </div>
            </nav>
        )
    }
}

export default MidBar