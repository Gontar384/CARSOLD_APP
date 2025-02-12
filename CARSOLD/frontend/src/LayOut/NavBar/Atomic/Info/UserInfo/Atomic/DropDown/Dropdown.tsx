import React from "react";
import {useItems} from "../../../../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../../../../../../GlobalProviders/Auth/useAuth.ts";
import DropdownFunctionButton from "./Atomic/DropdownFunctionButton.tsx";
import DropdownButton from "./Atomic/DropdownButton.tsx";


interface DropdownProps {
    barActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive }) => {

    const {followed, messages} = useItems();
    const {isMobile, toggleDarkMode, darkMode} = useUtil();
    const {handleLogout} = useAuth();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    return (
        <>
            {barActive &&
                <div className="flex flex-col items-center justify-center w-[130px] absolute top-14 bg-lime shadow-bottom"
                     onTouchStart={isMobile ? handleDropdownInteraction : undefined}>
                    <DropdownButton label="MyOffers" path={"/details/myOffers"}/>
                    <DropdownButton label="Followed" path={"/details/followed"} count={followed}/>
                    <DropdownButton label="Messages" path={"/details/messages"} count={messages}/>
                    <DropdownButton label="Settings" path={"/details/settings"}/>
                    <DropdownFunctionButton label={`${darkMode ? "Light" : "Dark"} mode`} onClick={toggleDarkMode}/>
                    <DropdownFunctionButton label="Logout" onClick={handleLogout}/>
                </div>}
        </>
    )
}

export default Dropdown