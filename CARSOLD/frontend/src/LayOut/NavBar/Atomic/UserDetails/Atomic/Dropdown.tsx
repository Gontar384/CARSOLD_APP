import React from "react";
import DropdownButton from "./DropdownButton.tsx";
import {useNavigate} from "react-router-dom";
import {useUserDetails} from "../../../../../CustomHooks/UseUserDetails.ts";
import {useItems} from "../../../../../GlobalProviders/ItemsProvider.tsx";
import {useUtil} from "../../../../../GlobalProviders/UtilProvider.tsx";

interface DropdownProps {
    barActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive }) => {

    const { followed, messages } = useItems();

    const navigate = useNavigate();

    const {isMobile} = useUtil();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    const { toggleDarkMode, darkMode } = useUtil();

    const { logout } = useUserDetails();

    return (
        <>
            {barActive &&
                <div
                    onTouchStart={isMobile ? handleDropdownInteraction : undefined}
                    className="flex flex-col items-center justify-center w-[75px] lg:w-[100px] xl:w-[120px] 2xl:w-[148px] 3xl:w-[180px]
                    absolute top-9 lg:top-10 xl:top-12 2xl:top-[52px] 3xl:top-14 bg-lime shadow-bottom">
                    <DropdownButton label="MyOffers" onClick={() => navigate("/details/myOffers")} serial={0}/>
                    <DropdownButton label="Followed" onClick={() => navigate('/details/followed')} count={followed} serial={1}/>
                    <DropdownButton label="Messages" onClick={() => navigate('/details/messages')} count={messages} serial={2}/>
                    <DropdownButton label="Settings" onClick={() => navigate('/details/settings')} serial={3}/>
                    <DropdownButton label={`${darkMode ? "Light" : "Dark"} mode`} onClick={toggleDarkMode} serial={4}/>
                    <DropdownButton label="Logout" onClick={logout} serial={5}/>
                </div>}
        </>
    )
}

export default Dropdown