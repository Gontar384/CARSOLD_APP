import React from "react";
import Loader from "./Atomic/Loader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";

interface UserDetailsProps {
    modeIconAnimation: "animate-fill" | "animate-empty" | null;
    setModeIconAnimation: React.Dispatch<React.SetStateAction<"animate-fill" | "animate-empty" | null>>;
    modeIcon1Animation: "animate-fill" | "animate-empty" | null;
    setModeIcon1Animation: React.Dispatch<React.SetStateAction<"animate-fill" | "animate-empty" | null>>;
    handleDarkMode: () => void;
    logout: () => void;
    navigate: (path: string) => void;
    usernameFetched: boolean;
    userDetails: string;
    userIconAnimation: "animate-pop" | null;
    barActive: boolean;
    handleActivateBar: () => void;
    handleDeactivateBar: () => void;
    handleActivateBarKeyboard: () => void;
    handleToggleBar: () => void;
    handleDropdownInteraction: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void
    isAuthenticated: boolean;
    darkMode: boolean;
    followed: number;
    messages: number;
}

const UserDetails: React.FC<UserDetailsProps> = ({ modeIconAnimation, modeIcon1Animation, userIconAnimation, handleDarkMode,
                                                     logout, usernameFetched, userDetails, barActive, handleActivateBar,
                                                     handleDeactivateBar, handleActivateBarKeyboard, darkMode, followed, messages,
                                                     handleDropdownInteraction, navigate, isAuthenticated, handleToggleBar}) => {

    return (
        <div
            className="flex justify-center items-center h-full min-w-[142px] lg:min-w-[178px] xl:min-w-[213px] 2xl:min-w-[268px] 3xl:min-w-[322px]">
            {isAuthenticated ? (
                usernameFetched ? (
                    <div className="relative h-full flex justify-center items-center"
                         onMouseEnter={handleActivateBar}
                         onMouseLeave={handleDeactivateBar}
                         onTouchStart={handleToggleBar}
                         onKeyDown={(event) => {if (event.key === "Enter") handleActivateBarKeyboard()}}>
                        <button
                            className="flex flex-row items-center h-full gap-[2px] lg:gap-[3px] xl:gap-1 2xl:gap-[6px] 3xl:gap-2 relative">
                            <FontAwesomeIcon icon={faCircleUser}
                                             className={`mb-[3px] lg:-mt-[2px] xl:mt-[0px] 3xl:-mt-1 text-sm lg:text-[18px] 
                                             xl:text-[22px] 2xl:text-[28px] 3xl:text-[34px] ${userIconAnimation}`}/>
                            <div className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 whitespace-nowrap cursor-pointer">
                                {userDetails}
                            </div>
                            {messages > 0 && (
                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                                 className="absolute -right-[10px] lg:-right-[12px] xl:-right-[15px]
                                                 2xl:-right-[18px] 3xl:-right-[22px] top-[14px] lg:top-[16px] xl:top-[20px] 2xl:top-[21px] text-[6px] lg:text-[7px] xl:text-[9px]
                                                 2xl:text-[11px] 3xl:text-[13px]"/>)}
                        </button>
                        <Dropdown barActive={barActive} modeIconAnimation={modeIconAnimation} modeIcon1Animation={modeIcon1Animation}
                                  handleDropdownInteraction={handleDropdownInteraction} handleDarkMode={handleDarkMode}
                                  darkMode={darkMode} logout={logout} navigate={navigate} followed={followed} messages={messages}/>
                    </div>
                ) : (
                    <Loader/>
                )
            ) : (
                <LoginButton navigate={navigate}/>
            )}
        </div>
    )
}

export default UserDetails
