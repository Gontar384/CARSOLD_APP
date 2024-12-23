import React, {useEffect, useRef, useState} from "react";
import UserDetailsLoader from "../../../../SharedComponents/Additional/Loading/UserDetailsLoader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";


const UserDetails: React.FC = () => {

    const {isAuthenticated, loadingAuth} = useAuth();

    const {userDetails, usernameFetched, handleUsernameFetch, profilePic, handleProfilePicFetch} = useUserDetails();

    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);

    const [animationActive, setAnimationActive] = useState<boolean>(false);   //prevents too many animations

    const [barActive, setBarActive] = useState<boolean>(false);

    const [barHovered, setBarHovered] = useState<boolean>(false);

    const {CreateDebouncedValue, isMobile} = useUtil();

    const debouncedHover: boolean = CreateDebouncedValue(barHovered, 300)

    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error

    const {profilePicChange, messages} = useItems();

    //fetches username and profile pic
    useEffect(() => {
        handleUsernameFetch().then();
        handleProfilePicFetch().then();
    }, [handleProfilePicFetch, handleUsernameFetch, isAuthenticated, profilePicChange]);

    const handleActivateBar = () => {
        setBarActive(true);
        setBarHovered(true);
        if (!animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        }
    }    //activates bar on mouse

    const handleDeactivateBar = () => {
        setBarHovered(false);
        setUserIconAnimation(null);
    }   //deactivates on mouse

    useEffect(() => {
        if (!debouncedHover && !barHovered) {
            setBarActive(false);
            setAnimationActive(false);
        }
    }, [debouncedHover, barHovered]);  //for user-friendly delay on MouseLeave

    const handleToggleBar = () => {
        setBarActive(prev => !prev);
        setUserIconAnimation(prev => prev === "animate-pop" ? null : "animate-pop");
    };   //for mobile and keyboard

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setBarActive(false);
                setUserIconAnimation(null);
                setAnimationActive(false);
            }
        };

        if (barActive) {
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [barActive]); //adds event listener for faster button deactivation

    if (loadingAuth) {
        return <UserDetailsLoader/>
    }

    return (
        <div
            className="flex justify-center items-center h-full min-w-[150px] lg:min-w-[190px] xl:min-w-[225px] 2xl:min-w-[280px] 3xl:min-w-[335px]"
            ref={componentRef}>
            {isAuthenticated ? (
                usernameFetched ? (
                    <div className="relative h-full flex justify-center items-center hover: cursor-pointer"
                            onMouseEnter={!isMobile ? handleActivateBar : undefined}
                            onMouseLeave={!isMobile ? handleDeactivateBar : undefined}
                            onTouchStart={isMobile ? handleToggleBar : undefined}
                            onKeyDown={(event) => {
                        if (event.key === "Enter") handleToggleBar()
                    }}>
                        <div className="flex flex-row items-center h-full gap-[5px] lg:gap-[6px] xl:gap-[7px] 2xl:gap-[9px] 3xl:gap-[11px] relative">
                            <div className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px] xl:w-[26px] xl:h-[26px] 2xl:w-[32px]
                                                      2xl:h-[32px] 3xl:w-[38px] 3xl:h-[38px] mb-[4px] lg:mb-[3px] 3xl:mb-[5px]">
                            {profilePic !== "" && !imageError ? (
                                <img src={profilePic} alt="Profile Picture" className={`object-cover w-full h-full rounded-full ${userIconAnimation}`}
                                     onError={() => setImageError(true)}/>
                            ) : (
                            <FontAwesomeIcon icon={faCircleUser} className={`w-full h-full ${userIconAnimation}`}/>)}
                            </div>
                            <div
                                className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 whitespace-nowrap cursor-pointer">
                                {userDetails}
                            </div>
                            {messages > 0 && (
                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                                 className="absolute -right-[10px] lg:-right-[12px] xl:-right-[15px] 2xl:-right-[18px] 3xl:-right-[22px] top-[13px] lg:top-[14px]
                                                 xl:top-[17px] 2xl:top-[18px] 3xl:top-[16px] text-[6px] lg:text-[7px] xl:text-[9px] 2xl:text-[11px] 3xl:text-[13px]"/>)}
                        </div>
                        <Dropdown barActive={barActive}/>
                    </div>
                ) : (
                    <UserDetailsLoader/>
                )
            ) : (
                <LoginButton/>
            )}
        </div>
    )
}

export default UserDetails