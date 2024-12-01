import React from "react";
import Button from "./Atomic/Button.tsx";
import {
    faAddressCard,
    faHeart,
    faMessage,
    faRightFromBracket,
    faSquarePlus,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import DarkModeButton from "./Atomic/DarkModeButton.tsx";

interface LowerBarProps {
    barAnimation: "animate-slideDown" | "animate-slideUp" | null,
    logout: () => Promise<void>;
    modeIconAnimation: "animate-fill" | "animate-empty" | null;
    modeIcon1Animation: "animate-fill" | "animate-empty" | null;
    handleDarkMode: () => void;
    handleTouchStart: (index: number) => void;
    handleTouchEnd: (index: number) => void;
    handleMouseEnter: (index: number) => void;
    handleMouseLeave: (index: number) => void;
    buttonColor: string [];
    followed: number;
    messages: number;
    navigate: (path: string) => void;
    isAuthenticated: boolean;
}

const LowerBar: React.FC<LowerBarProps> = ({barAnimation, logout, modeIconAnimation, modeIcon1Animation, handleDarkMode,
                                               handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave, buttonColor,
                                               followed, messages, navigate, isAuthenticated}) => {

    return (
        <div
            className={`flex flex-row items-center justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 
            right-0 bg-lime shadow-top z-50 ${barAnimation}`}>
            <Button
                onClick={() => navigate("/myAccount/myOffers")}
                icon={faSquarePlus}
                label="Add Offer"
                handleTouchStart={() => handleTouchStart(0)} handleTouchEnd={() => handleTouchEnd(0)} handleMouseEnter={() => handleMouseEnter(0)}
                handleMouseLeave={() => handleMouseLeave(0)} buttonColor={buttonColor[0]}
            />
            <Button
                onClick={() => navigate("/myAccount/followed")}
                icon={faHeart}
                label="Followed"
                count={followed}
                handleTouchStart={() => handleTouchStart(1)} handleTouchEnd={() => handleTouchEnd(1)} handleMouseEnter={() => handleMouseEnter(1)}
                handleMouseLeave={() => handleMouseLeave(1)} buttonColor={buttonColor[1]}
            />
            <Button
                onClick={() => navigate("/myAccount/messages")}
                icon={faMessage}
                label="Messages"
                count={messages}
                handleTouchStart={() => handleTouchStart(2)} handleTouchEnd={() => handleTouchEnd(2)} handleMouseEnter={() => handleMouseEnter(2)}
                handleMouseLeave={() => handleMouseLeave(2)} buttonColor={buttonColor[2]}
            />
            <Button
                onClick={() => navigate("/myAccount/myOffers")}
                icon={faUser}
                label="Account"
                handleTouchStart={() => handleTouchStart(3)} handleTouchEnd={() => handleTouchEnd(3)} handleMouseEnter={() => handleMouseEnter(3)}
                handleMouseLeave={() => handleMouseLeave(3)} buttonColor={buttonColor[3]}
            />
            {isAuthenticated ? (
                <>
                    <DarkModeButton
                        modeIconAnimation={modeIconAnimation}
                        modeIcon1Animation={modeIcon1Animation}
                        handleDarkMode={handleDarkMode}
                        handleTouchStart={() => handleTouchStart(4)} handleTouchEnd={() => handleTouchEnd(4)} handleMouseEnter={() => handleMouseEnter(4)}
                        handleMouseLeave={() => handleMouseLeave(4)} buttonColor={buttonColor[4]}
                    />
                    <Button
                        onClick={logout}
                        icon={faRightFromBracket}
                        label="Logout"
                        handleTouchStart={() => handleTouchStart(5)} handleTouchEnd={() => handleTouchEnd(5)} handleMouseEnter={() => handleMouseEnter(5)}
                        handleMouseLeave={() => handleMouseLeave(5)} buttonColor={buttonColor[5]}
                    />
                </>
            ) : (
                <Button
                    onClick={() => navigate("/authenticate/login")}
                    icon={faAddressCard}
                    label="Login"
                    handleTouchStart={() => handleTouchStart(6)} handleTouchEnd={() => handleTouchEnd(6)} handleMouseEnter={() => handleMouseEnter(6)}
                    handleMouseLeave={() => handleMouseLeave(6)} buttonColor={buttonColor[6]}
                />
            )}
        </div>
    )
}

export default LowerBar