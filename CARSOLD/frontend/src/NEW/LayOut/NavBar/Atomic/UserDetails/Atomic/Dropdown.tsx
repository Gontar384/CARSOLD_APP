import React from "react";
import DropdownButton from "./DropdownButton.tsx";
import {useNavigate} from "react-router-dom";
import {useItems} from "../../../../../../GlobalProviders/ItemsProvider.tsx";
import {useUserDetails} from "../UserDetails.tsx";
import {useLowerBar} from "../../LowerBar/LowerBar.tsx";

interface DropdownProps {
    barActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive }) => {

    const { logout } = useUserDetails();

    const navigate = useNavigate();

    const { followed, messages } = useItems();

    const { handleDarkMode } = useLowerBar();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation(); //prevents closing the dropdown buttons when clicking on them
    };  //prevent closing

    return (
        <>
            {barActive &&
                <div
                    onTouchStart={handleDropdownInteraction}
                    className="flex flex-col items-center justify-center w-[75px] lg:w-[100px] xl:w-[120px] 2xl:w-[148px] 3xl:w-[180px]
                    absolute top-9 lg:top-10 xl:top-12 2xl:top-[52px] 3xl:top-14 bg-lime shadow-bottom">
                    <DropdownButton label="MyOffers" onClick={() => navigate("/myAccount/myOffers")}/>
                    <DropdownButton label="Followed" onClick={() => navigate('/myAccount/followed')} count={followed}/>
                    <DropdownButton label="Messages" onClick={() => navigate('/myAccount/messages')} count={messages}/>
                    <DropdownButton label="Settings" onClick={() => navigate('/myAccount/settings')}/>
                    <DropdownButton label="Change mode" onClick={handleDarkMode}/>
                    <DropdownButton label="Logout" onClick={logout}/>
                </div>}
        </>
    )
}

export default Dropdown