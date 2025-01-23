import React from "react";
import DropdownButton from "./Atomic/DropdownButton.tsx";
import {useNavigate} from "react-router-dom";
import {useUserDetails} from "../../../../../../CustomHooks/useUserDetails.ts";
import {useItems} from "../../../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";


interface DropdownProps {
    barActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive }) => {

    const { followed, messages } = useItems();

    const navigate = useNavigate();

    const {isMobile, toggleDarkMode, darkMode} = useUtil();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    const { logout } = useUserDetails();

    return (
        <>
            {barActive &&
                <div
                    onTouchStart={isMobile ? handleDropdownInteraction : undefined}
                    className="flex flex-col items-center justify-center w-[130px]
                    absolute top-12 bg-lime shadow-bottom">
                    <DropdownButton label="MyOffers" onClick={() => navigate("/details/myOffers")}/>
                    <DropdownButton label="Followed" onClick={() => navigate('/details/followed')} count={followed}/>
                    <DropdownButton label="Messages" onClick={() => navigate('/details/messages')} count={messages}/>
                    <DropdownButton label="Settings" onClick={() => navigate('/details/settings')}/>
                    <DropdownButton label={`${darkMode ? "Light" : "Dark"} mode`} onClick={toggleDarkMode}/>
                    <DropdownButton label="Logout" onClick={logout}/>
                </div>}
        </>
    )
}

export default Dropdown