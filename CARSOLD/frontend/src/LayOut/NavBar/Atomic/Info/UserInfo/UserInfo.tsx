import React, {useEffect, useRef, useState} from "react";
import UserInfoLoader from "../../../../../Additional/Loading/UserInfoLoader.tsx";
import LoginRegisterButton from "../LoginRegisterButton/LoginRegisterButton.tsx";
import Dropdown from "./Atomic/Dropdown/Dropdown.tsx";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import Details from "./Atomic/Details.tsx";
import {useUserUtil} from "../../../../../GlobalProviders/UserUtil/useUserUtil.ts";

const UserInfo: React.FC = () => {
    const {isAuthenticated, loadingAuth} = useAuth();
    const {usernameFetched, profilePicFetched} = useUserUtil();
    const [iconAnimation, setIconAnimation] = useState<"animate-pop" | null>(null);
    const [barActive, setBarActive] = useState<boolean>(false);
    const [closing, setClosing] = useState<boolean>(false);
    const [dropdownAnimation, setDropdownAnimation] = useState<"animate-unroll" | "animate-unrollRev" | null>(null);
    const {isMobile} = useUtil();
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar
    const deactivationTimeout = useRef<NodeJS.Timeout | null>(null);  //for delays
    const animationTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleActivateBar = () => {
        if (!barActive || closing) {
            setBarActive(true);
            setIconAnimation("animate-pop");
            setDropdownAnimation("animate-unroll");
        }
        if (deactivationTimeout.current) {
            clearTimeout(deactivationTimeout.current);
            deactivationTimeout.current = null;
        }
        if (animationTimeout.current) {
            setClosing(false);
            clearTimeout(animationTimeout.current);
            animationTimeout.current = null;
        }
    }

    const handleDeactivateBar = () => {
        if (barActive) {
            deactivationTimeout.current = setTimeout(() => {
                setClosing(true);
            }, 300);
        }
    };

    useEffect(() => {
        if (closing) {
            setIconAnimation(null);
            setDropdownAnimation("animate-unrollRev");
            animationTimeout.current = setTimeout(() => {
                setBarActive(false);
                setClosing(false);
            }, 300);
        }

        return () => {
            if (animationTimeout.current) {
                clearTimeout(animationTimeout.current);
            }
        };
    }, [closing]);   //delay for animation

    const handleToggleBar = () => {
        if (!barActive) {
            setBarActive(true);
            setDropdownAnimation("animate-unroll");
        } else {
            setClosing(true);
        }
        setIconAnimation(prev => prev === "animate-pop" ? null : "animate-pop");
    };   //for mobile and keyboard

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setClosing(true);
                setIconAnimation(null);
            }
        };

        if (barActive) document.addEventListener("touchstart", handleClickOutside);

        return () => document.removeEventListener("touchstart", handleClickOutside);
    }, [barActive]);    //adds event listener for faster button deactivation for mobile

    if (loadingAuth) {
        return <UserInfoLoader/>
    }

    return (
        <div className="flex justify-center items-center h-full min-w-[220px]"
            ref={componentRef}>
            {isAuthenticated ? (
                usernameFetched && profilePicFetched ? (
                    <div className="relative h-full flex justify-center items-center hover: cursor-pointer"
                         tabIndex={0} role="button"
                         onMouseEnter={!isMobile ? handleActivateBar : undefined}
                         onMouseLeave={!isMobile ? handleDeactivateBar : undefined}
                         onTouchStart={isMobile ? handleToggleBar : undefined}
                         onKeyDown={(event) => {if (event.key === "Enter") handleToggleBar()}}>
                        <Details iconAnimation={iconAnimation}/>
                        <Dropdown barActive={barActive} animation={dropdownAnimation}/>
                    </div>
                ) : (
                    <UserInfoLoader/>
                )
            ) : (
                <LoginRegisterButton/>
            )}
        </div>
    )
}

export default UserInfo