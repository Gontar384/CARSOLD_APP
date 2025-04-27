import React from "react";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../../../../../../GlobalProviders/Auth/useAuth.ts";
import DropdownButton from "./Atomic/DropdownButton.tsx";
import DropdownFunctionButton from "./Atomic/DropdownFunctionButton.tsx";
import {useMessages} from "../../../../../../../GlobalProviders/Messages/useMessages.ts";

interface DropdownProps {
    barActive: boolean;
    animation: "animate-unroll" | "animate-unrollRev" | null;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive, animation }) => {

    const {unseenMessagesCount} = useMessages();
    const {isMobile, toggleDarkMode, darkMode} = useUtil();
    const {handleLogout} = useAuth();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    return (
        <>
            {barActive &&
                <div className={`flex flex-col items-center justify-center w-[130px] absolute top-14
                bg-lime shadow-bottom ${animation}`}
                     onTouchStart={isMobile ? handleDropdownInteraction : undefined}>
                    <DropdownButton label="My offers" path={"/details/myOffers"}/>
                    <DropdownButton label="Followed" path={"/details/followed"}/>
                    <DropdownButton label="Messages" path={"/details/messages"} count={unseenMessagesCount}/>
                    <DropdownButton label="Settings" path={"/details/settings"}/>
                    <DropdownFunctionButton label={`${darkMode ? "Light" : "Dark"} mode`} onClick={toggleDarkMode}/>
                    <DropdownFunctionButton label="Logout" onClick={handleLogout}/>
                </div>}
        </>
    )
}

export default Dropdown