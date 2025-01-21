import React, {useEffect, useRef, useState} from "react";
import UserDetailsLoader from "../../../../SharedComponents/Additional/Loading/UserDetailsLoader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown/Dropdown.tsx";
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
            className="flex justify-center items-center h-full min-w-[200px] m:min-w-[220px]"
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
                        <div className="flex flex-row items-center h-full gap-[3px] m:gap-[5px] relative">
                            <div className="w-[22px] h-[22px] m:w-[25px] m:h-[25px]">
                            {profilePic !== "" && !imageError ? (
                                <img src={profilePic} alt="Profile Picture" className={`object-cover w-full h-full rounded-full ${userIconAnimation}`}
                                     onError={() => setImageError(true)}/>
                            ) : (
                            <FontAwesomeIcon icon={faCircleUser} className={`w-full h-full ${userIconAnimation}`}/>)}
                            </div>
                            <div
                                className="text-xl m:text-2xl whitespace-nowrap cursor-pointer">
                                {userDetails}
                            </div>
                            {messages > 0 && (
                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                                 className="absolute -right-[14px] m:-right-4 top-[14px] m:top-4 text-[8px] m:text-[10px]"/>)}
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