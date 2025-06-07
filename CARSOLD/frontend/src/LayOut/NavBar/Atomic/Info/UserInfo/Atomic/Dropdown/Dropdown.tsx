import React from "react";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../../../../../../GlobalProviders/Auth/useAuth.ts";
import DropdownButton from "./Atomic/DropdownButton.tsx";
import DropdownFunctionButton from "./Atomic/DropdownFunctionButton.tsx";
import {useMessages} from "../../../../../../../GlobalProviders/Messages/useMessages.ts";
import {useLanguage} from "../../../../../../../GlobalProviders/Language/useLanguage.ts";

interface DropdownProps {
    barActive: boolean;
    animation: "animate-unroll" | "animate-unrollRev" | null;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive, animation }) => {
    const {unseenMessagesCount} = useMessages();
    const {isMobile, toggleDarkMode, darkMode} = useUtil();
    const {handleLogout} = useAuth();
    const {t} = useLanguage();

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };  //prevents closing bar

    return (
        <>
            {barActive &&
                <div className={`flex flex-col items-center justify-center w-[140px] absolute top-14
                bg-lime shadow-bottom ${animation}`}
                     onTouchStart={isMobile ? handleDropdownInteraction : undefined}>
                    <DropdownButton label={t("dropdownButton1")} path={"/details/myOffers?page=0"}/>
                    <DropdownButton label={t("dropdownButton2")} path={"/details/followed?page=0"}/>
                    <DropdownButton label={t("dropdownButton3")} path={"/details/messages"} count={unseenMessagesCount}/>
                    <DropdownButton label={t("dropdownButton4")} path={"/details/settings"}/>
                    <DropdownFunctionButton label={`${darkMode ? t("dropdownButton5") : t("dropdownButton6")}`} onClick={toggleDarkMode}/>
                    <DropdownFunctionButton label={t("dropdownButton7")} onClick={handleLogout}/>
                </div>}
        </>
    )
}

export default Dropdown