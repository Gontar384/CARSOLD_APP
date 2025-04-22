import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange/PasswordChange.tsx";
import {useUserInfo} from "../../../../CustomHooks/useUserInfo.ts";
import AnimatedBanner from "../../../../Additional/Banners/AnimatedBanner.tsx";
import ContactInfo from "./Atomic/ContactInfo/ContactInfo.tsx";
import DeleteAccountButton from "./Atomic/DeleteAccount/DeleteAccountButton.tsx";
import Popup from "./Atomic/DeleteAccount/Popup/Popup.tsx";

const Settings: React.FC = () => {
    document.title = "CARSOLD | Settings";
    const {handleCheckGoogleAuth} = useUserInfo();
    const [googleAuth, setGoogleAuth] = useState<boolean | null>(null);
    const [popup, setPopup] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState<boolean>(false);   //banner

    useEffect(() => {
        const checkGoogleAuthentication = async () => {
            const isGoogleUser = await handleCheckGoogleAuth();
            setGoogleAuth(isGoogleUser);
        }
        checkGoogleAuthentication();

    }, []);

    if (googleAuth === null) return null;

    return (
        <div className="w-full h-full">
            <div className={`flex flex-col items-center`}>
                <ContactInfo/>
                {!googleAuth && <PasswordChange setIsChanged={setIsChanged}/>}
                <DeleteAccountButton setPopup={setPopup}/>
            </div>
            {isChanged && <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                          onAnimationEnd={() => setIsChanged(false)} delay={3000}/>}
            {popup && <Popup setPopup={setPopup} googleLogged={googleAuth}/>}
        </div>
    )
}

export default Settings