import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange.tsx";
import {useUserCheck} from "../../../../CustomHooks/useUserCheck.ts";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ContactInfo from "./Atomic/ContactInfo/ContactInfo.tsx";
import DeleteAccountButton from "./Atomic/DeleteAccountButton.tsx";

const Settings: React.FC = () => {

    const {checkGoogleAuth} = useUserCheck();
    const [googleLogged, setGoogleLogged] = useState<boolean | null>(null);

    const {isWide} = useUtil();

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
        return (
            <div className="w-full h-full bg-lowLime animate-pulse"></div>
        )
    }

    return (
        <div className="w-full h-full bg-lowLime rounded-sm">
            <div className={`flex h-full w-full ${isWide ? "flex-row" : "flex-col gap-14 xs:gap-16 mb-12 xs:mb-14"}`}>
                <div className={`flex flex-col ${isWide ? " w-4/12" : "w-full"}`}>
                    <ContactInfo/>
                </div>
                <div className={`flex flex-col items-center ${isWide ? "w-6/12 justify-center" : "w-full"}`}>
                    {!googleLogged && <PasswordChange setIsChanged={setIsChanged}/>}
                </div>
                <div className={`${isWide ? "w-2/12" : "w-full mt-6 xs:mt-8"}`}>
                    <DeleteAccountButton/>
                </div>
            </div>
            {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                         onAnimationEnd={() => setIsChanged(false)} delay={3000}/> : null}
        </div>
    )
}

export default Settings