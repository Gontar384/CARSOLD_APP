import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange.tsx";
import {useUserCheck} from "../../../../CustomHooks/useUserCheck.ts";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

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
            <div className={`flex items-center justify-center h-full w-full ${isWide ? "flex-row" : "flex-col"}`}>
                <div className={`flex flex-col items-center ${isWide ? "justify-center w-1/2 h-full" : "w-full"}`}>

                </div>
                {!googleLogged ?
                    <div className={`flex flex-col items-center ${isWide ? "justify-center w-1/2 h-full" : "w-full"}`}>
                        <PasswordChange setIsChanged={setIsChanged}/>
                    </div> : null}
            </div>
            {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                         onAnimationEnd={() => setIsChanged(false)} delay={3000}/> : null}
        </div>
    )
}

export default Settings