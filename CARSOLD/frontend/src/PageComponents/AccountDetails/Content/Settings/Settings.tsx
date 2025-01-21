import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange/PasswordChange.tsx";
import {useUserCheck} from "../../../../CustomHooks/useUserCheck.ts";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ContactInfo from "./Atomic/ContactInfo/ContactInfo.tsx";
import DeleteAccountButton from "./Atomic/DeleteAccount/DeleteAccountButton.tsx";
import Popup from "./Atomic/DeleteAccount/Popup/Popup.tsx";

const Settings: React.FC = () => {

    const {checkGoogleAuth} = useUserCheck();
    const [googleLogged, setGoogleLogged] = useState<boolean | null>(null);
    const [popup, setPopup] = useState<boolean>(false);

    const {mobileWidth} = useUtil();

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
    }, []);

    const [isChanged, setIsChanged] = useState<boolean>(false);   //banner

    if (googleLogged === null) {
        return (
            <div className="w-full h-full bg-lowLime animate-pulse"></div>
        )
    }

    return (
        <div className="w-full h-full bg-lowLime rounded-sm">
            <div className={`flex h-full w-full ${!mobileWidth ? "flex-row" : "flex-col gap-16 mb-7"}`}>
                <div className={`flex flex-col ${!mobileWidth ? " w-4/12" : "w-full"}`}>
                    <ContactInfo/>
                </div>
                <div className={`flex flex-col items-center ${!mobileWidth ? "w-6/12 justify-center" : "w-full"}`}>
                    {!googleLogged && <PasswordChange setIsChanged={setIsChanged}/>}
                </div>
                <div className={`${!mobileWidth ? "w-2/12" : "w-full mt-2 xs:-mt-3"}`}>
                    <DeleteAccountButton setPopup={setPopup}/>
                </div>
            </div>
            {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                         onAnimationEnd={() => setIsChanged(false)} delay={3000}/> : null}
            {popup ? <Popup setPopup={setPopup} googleLogged={googleLogged}/> : null}
        </div>
    )
}

export default Settings