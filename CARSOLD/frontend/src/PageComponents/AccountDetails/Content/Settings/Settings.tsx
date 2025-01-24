import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange/PasswordChange.tsx";
import {useUserCheck} from "../../../../CustomHooks/useUserCheck.ts";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import ContactInfo from "./Atomic/ContactInfo/ContactInfo.tsx";
import DeleteAccountButton from "./Atomic/DeleteAccount/DeleteAccountButton.tsx";
import Popup from "./Atomic/DeleteAccount/Popup/Popup.tsx";

const Settings: React.FC = () => {

    const {checkGoogleAuth} = useUserCheck();
    const [googleLogged, setGoogleLogged] = useState<boolean | null>(null);
    const [popup, setPopup] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        const fetchGoogleAuthStatus = async () => {
            try {
                const response = await checkGoogleAuth();
                if (response.data && isMounted) {
                    setGoogleLogged(response.data.checks);
                }
            } catch (error) {
                console.error("Error fetching OAuth2 status: ", error);
            }
        }

        fetchGoogleAuthStatus().then();

        return () => {
            isMounted = false;
        }
    }, [checkGoogleAuth]);

    const [isChanged, setIsChanged] = useState<boolean>(false);   //banner

    if (googleLogged === null) {
        return null;
    }

    return (
        <div className="w-full h-full">
            <div className={`flex flex-col items-center`}>
                <ContactInfo/>
                {!googleLogged && <PasswordChange setIsChanged={setIsChanged}/>}
                <DeleteAccountButton setPopup={setPopup}/>
            </div>
            {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                         onAnimationEnd={() => setIsChanged(false)} delay={3000}/> : null}
            {popup ? <Popup setPopup={setPopup} googleLogged={googleLogged}/> : null}
        </div>
    )
}

export default Settings