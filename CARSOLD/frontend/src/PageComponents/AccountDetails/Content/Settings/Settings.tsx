import React, {useEffect, useState} from "react";
import PasswordChange from "./Atomic/PasswordChange.tsx";
import {useUserCheck} from "../../../../CustomHooks/useUserCheck.ts";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";

const Settings: React.FC = () => {

    const {checkGoogleAuth} = useUserCheck();
    const [googleLogged, setGoogleLogged] = useState<boolean | null>(null);

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
        <div className="flex flex-row items-center justify-center w-full h-full p-2 xl:p-3 2xl:p-4 3xl:p-5 text-center
        text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl bg-lowLime rounded-sm">
            {!googleLogged ? <PasswordChange setIsChanged={setIsChanged}/> : null}
            {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}
                                         onAnimationEnd={() => setIsChanged(false)} delay={3000}/> : null}
        </div>
    )
}

export default Settings