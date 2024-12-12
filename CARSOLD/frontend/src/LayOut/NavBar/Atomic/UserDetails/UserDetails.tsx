import React, {useEffect, useRef, useState} from "react";
import UserDetailsLoader from "../../../../Additional/Loading/UserDetailsLoader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useUserDetails} from "../../../CustomHooks/UseUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/AuthProvider.tsx";
import {useUtil} from "../../../../GlobalProviders/UtilProvider.tsx";
import {useItems} from "../../../../GlobalProviders/ItemsProvider.tsx";

const UserDetails: React.FC = () => {

    const {isAuthenticated, loadingAuth} = useAuth();

    const {userDetails, usernameFetched, handleUsernameFetch} = useUserDetails();

    useEffect(() => {
        handleUsernameFetch().then();
    }, [handleUsernameFetch, isAuthenticated]);  //fetches username

    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);

    const [animationActive, setAnimationActive] = useState<boolean>(false);   //prevents too many animations

    const [barActive, setBarActive] = useState<boolean>(false);

    const [barHovered, setBarHovered] = useState<boolean>(false);

    const {createDebouncedValue} = useUtil();

    const debouncedHover: boolean = createDebouncedValue(barHovered, 300)

    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const {isMobile} = useUtil();

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
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
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

    const {messages} = useItems();

    if (loadingAuth) {
        return <UserDetailsLoader/>
    }

    return (
        <div
            className="flex justify-center items-center h-full min-w-[142px] lg:min-w-[178px] xl:min-w-[213px] 2xl:min-w-[268px] 3xl:min-w-[322px]"
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
                        <div
                            className="flex flex-row items-center h-full gap-[2px] lg:gap-[3px] xl:gap-1 2xl:gap-[6px] 3xl:gap-2 relative">
                            <FontAwesomeIcon icon={faCircleUser}
                                             className={`mb-[3px] xl:mb-[2px] 3xl:mb-[5px] text-sm lg:text-[18px] xl:text-[22px] 2xl:text-[28px] 3xl:text-[34px] ${userIconAnimation}`}/>
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
