import React from "react";
import {useNavigate} from "react-router-dom";
import {useItems} from "../../../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../../../../../GlobalProviders/Auth/useAuth.ts";
import DropdownButton from "./Atomic/DropdownButton.tsx";


interface DropdownProps {
    barActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive }) => {

    const {followed, messages} = useItems();
    const navigate = useNavigate();
    const {isMobile, toggleDarkMode, darkMode} = useUtil();
    const {handleLogout} = useAuth();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    return (
        <>
            {barActive &&
                <div
                    onTouchStart={isMobile ? handleDropdownInteraction : undefined}
                    className="flex flex-col items-center justify-center w-[130px]
                    absolute top-14 bg-lime shadow-bottom">
                    <DropdownButton label="MyOffers" onClick={() => navigate("/details/myOffers")}/>
                    <DropdownButton label="Followed" onClick={() => navigate('/details/followed')} count={followed}/>
                    <DropdownButton label="Messages" onClick={() => navigate('/details/messages')} count={messages}/>
                    <DropdownButton label="Settings" onClick={() => navigate('/details/settings')}/>
                    <DropdownButton label={`${darkMode ? "Light" : "Dark"} mode`} onClick={toggleDarkMode}/>
                    <DropdownButton label="Logout" onClick={handleLogout}/>
                </div>}
        </>
    )
}

export default Dropdown