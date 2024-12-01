import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "./DropdownButton.tsx";

interface DropdownProps {
    barActive: boolean;
    darkMode: boolean;
    modeIconAnimation: "animate-fill" | "animate-empty" | null;
    modeIcon1Animation: "animate-fill" | "animate-empty" | null;
    navigate: (path: string) => void;
    handleDropdownInteraction: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void
    handleDarkMode: () => void;
    logout: () => void;
    followed: number;
    messages: number;
}

const Dropdown: React.FC<DropdownProps> = ({ barActive, darkMode, modeIconAnimation, modeIcon1Animation, navigate,
                                               handleDropdownInteraction, handleDarkMode, logout, followed, messages }) => {

    return (
        <>
            {barActive &&
                <div
                    onTouchStart={() => handleDropdownInteraction}
                    className="flex flex-col items-center justify-center w-[93px] lg:w-[109px] xl:w-[124px] 2xl:w-[148px] 3xl:w-[170px]
                    absolute top-[34px] lg:top-[38px] xl:top-[46px] 2xl:top-[50px] 3xl:top-[54px] bg-lime shadow-bottom">
                    <DropdownButton label="MyOffers" onClick={() => navigate("/myAccount/myOffers")}/>
                    <DropdownButton label="Followed" onClick={() => navigate('/myAccount/followed')} count={followed}
                                    icon={faCircle} color="#370eeb"/>
                    <DropdownButton label="Messages" onClick={() => navigate('/myAccount/messages')} count={messages}
                                    icon={faCircle} color="#ff0000"/>
                    <DropdownButton label="Settings" onClick={() => navigate('/myAccount/settings')}/>
                    <DropdownButton label="Mode" onClick={handleDarkMode}
                                    icon={darkMode ? (
                                        <FontAwesomeIcon icon={faMoon}
                                                         className={`text-[12px] lg:text-[16px] xl:text-[19px] 2xl:text-[24px] 3xl:text-[29px] -top-[7px]
                                                     lg:-top-[9px] xl:-top-[10px] 2xl:-top-[13px] 3xl:-top-[15px] ${modeIconAnimation} absolute`}/>
                                    ) : (
                                        <FontAwesomeIcon icon={faSun}
                                                         className={`text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] -top-[7px]
                                                         lg:-top-[9px] xl:-top-[10px] 2xl:-top-[13px] 3xl:-top-[15px] ${modeIcon1Animation} absolute`}/>
                                    )}
                    />
                    <DropdownButton label="Logout" onClick={logout}/>
                </div>}
        </>
    )
}

export default Dropdown