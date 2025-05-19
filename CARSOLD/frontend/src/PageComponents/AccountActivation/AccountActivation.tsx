import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import {activateAccount} from "../../ApiCalls/Services/UserService.ts";
import {BadRequestError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const AccountActivation: React.FC = () => {
    document.title = "CARSOLD | Account Activation";
    const [count, setCount] = useState<number>(3);
    const [activationMessage, setActivationMessage] = useState<string | null>(null);
    const [color, setColor] = useState<"bg-lime" | "bg-coolYellow" | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const navigate = useNavigate();
    const {handleCheckAuth} = useAuth();
    const {t} = useLanguage();

    const handleErrorResult = (message: string) => {
        setActivationMessage(message);
        setColor("bg-coolYellow");
        setLoaded(true);
        setTimeout(() => navigate("/authenticate/register"), 2700);
    };

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        const handleActivateAccount = async (token: string | null) => {
            try {
                await activateAccount(token);
                setActivationMessage(t("accountActivation2"));
                setColor("bg-lime");
                setLoaded(true);
                setTimeout(async () => await handleCheckAuth(), 2700);
            } catch (error: unknown) {
                if (error instanceof BadRequestError) {
                    console.error("Token is invalid or has expired: ", error.message, error.response);
                    handleErrorResult(t("accountActivation3"));
                } else { 
                    console.error("Unexpected error during account activation:", error);
                    handleErrorResult(t("accountActivation4"));
                }
            }
        };

        handleActivateAccount(token);

    }, [handleCheckAuth, navigate]);   //gets token from url and activates account

    useEffect(() => {
        const interval = setInterval((): void => {
            setCount(c => {
                if (c > 0) return c - 1;
                clearInterval(interval)
                return c;
            });
        }, 1000)

        return () => clearInterval(interval)
    }, []);    //timer

    if (!loaded) return null;

    return (
        <div className={`flex flex-col justify-center items-center h-screen`}>
            <div className={`absolute inset-0 animate-pulse z-0 ${color}`}></div>
            <div className="flex flex-col items-center justify-center text-2xl m:text-3xl gap-5 m:gap-8 z-10">
                <p className="text-center">{activationMessage}</p>
                <div className="flex justify-center items-center w-20 h-20 m:w-24 m:h-24 bg-lowBlack rounded-xl">
                    <p className="text-white text-6xl m:text-7xl font-bold font-mono">{count}</p>
                </div>
                <p>{t("accountActivation1")}</p>
            </div>
        </div>
    );
}

export default AccountActivation