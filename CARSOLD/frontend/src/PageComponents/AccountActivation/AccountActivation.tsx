import React, {useEffect, useState} from "react";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";

const AccountActivation: React.FC = () => {

    document.title = "CARSOLD | Account Activation";

    const [count, setCount] = useState<number>(3);
    const [activationMessage, setActivationMessage] = useState<string>("Account activation success.");
    const [color, setColor] = useState<"bg-lime" | "bg-coolYellow">("bg-lime");
    const [loaded, setLoaded] = useState<boolean>(false);
    const navigate = useNavigate();
    const {checkAuth} = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token: string | null = urlParams.get('token');

        const activateAccount = async (token: string) => {
            try {
                const response = await api.get(`api/auth/activate`,
                    { params: { token } });
                if (!response.data) {
                    setColor("bg-coolYellow");
                    setActivationMessage("Link has expired, register again please.");
                    setTimeout(() => navigate("/authenticate/register"), 3500);
                }
                setLoaded(true);
            } catch (error) {
                console.error("Error activating account: ", error);
            }
        };

        if (token) {
            activateAccount(token);
            setTimeout(() => checkAuth(), 3500);
        }

    }, [checkAuth, navigate]);   //gets token from url and activates account

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
                <p>Redirecting...</p>
            </div>
        </div>
    );
}

export default AccountActivation