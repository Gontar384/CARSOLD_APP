import React, {useEffect, useRef, useState} from "react";
import Logo from "./Atomic/Logo.tsx";
import SearchBar from "./Atomic/SearchBar.tsx";
import AddButton from "./Atomic/AddButton.tsx";
import UserInfo from "./Atomic/Info/UserInfo/UserInfo.tsx";
import OptionsButton from "./Atomic/OptionsButton.tsx";
import LowerBar from "./Atomic/LowerBar/LowerBar.tsx";
import LoadingNavBarLine from "../../Additional/Loading/LoadingNavBarLine.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import MidBar from "./Atomic/MidBar/MidBar.tsx";
import MessageNotification from "./MessageNotification/MessageNotification.tsx";
import LanguageButton from "./Atomic/LanguageButton.tsx";

const NavBar: React.FC = () => {
    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);  //OptionsButton animations
    const excludedButtonRef = useRef<HTMLButtonElement | null>(null);  //excludes OptionsButton from MidBar closing effect
    const {mobileWidth, midWidth, bigWidth} = useUtil();
    const {loadingAuth} = useAuth();

    useEffect(() => {
        if (bigWidth) setIconAnimation(null);
    }, [bigWidth]);

    return (
        <>
            <nav className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0 gap-2
            w-full h-12 m:h-14 shadow-bottom bg-lime z-50 touch-none">
                {(mobileWidth || midWidth) &&
                    <OptionsButton excludedButtonRef={excludedButtonRef}
                                   iconAnimation={iconAnimation} setIconAnimation={setIconAnimation}/>}
                {bigWidth ?
                    <>
                        <Logo/>
                        <LanguageButton/>
                        <SearchBar/>
                        <AddButton/>
                        <UserInfo/>
                    </> :
                    <>
                        <Logo/>
                        <SearchBar/>
                        <LanguageButton/>
                    </>}
                {loadingAuth && <LoadingNavBarLine/>}
            </nav>
            {mobileWidth && <LowerBar/>}
            {midWidth && <MidBar excludedButtonRef={excludedButtonRef} setIconAnimation={setIconAnimation}/>}
            <MessageNotification/>
        </>
    )
}

export default NavBar