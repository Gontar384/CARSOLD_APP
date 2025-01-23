import React, {useEffect, useRef, useState} from "react";
import UserDetailsLoader from "../../../../SharedComponents/Additional/Loading/UserDetailsLoader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown/Dropdown.tsx";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import Details from "./Atomic/Details.tsx";


const UserDetails: React.FC = () => {

    const {isAuthenticated, loadingAuth} = useAuth();
    const {userDetails, usernameFetched, handleUsernameFetch, profilePic, handleProfilePicFetch} = useUserDetails();
    const {profilePicChange} = useItems();

    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);
    const [animationActive, setAnimationActive] = useState<boolean>(false);   //prevents too many animations
    const [barActive, setBarActive] = useState<boolean>(false);
    const [barHovered, setBarHovered] = useState<boolean>(false);
    const {CreateDebouncedValue, isMobile} = useUtil();
    const debouncedHover: boolean = CreateDebouncedValue(barHovered, 300)
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

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
    }   //deactivates on mouse

    useEffect(() => {
        if (!debouncedHover && !barHovered) {
            setBarActive(false);
            setAnimationActive(false);
            setUserIconAnimation(null);
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
            className="flex justify-center items-center h-full min-w-[220px]"
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
                        <Details userIconAnimation={userIconAnimation} userDetails={userDetails} profilePic={profilePic}/>
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