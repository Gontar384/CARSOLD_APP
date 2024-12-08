import React, {useEffect, useState} from "react";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.tsx";
import {useNavigate} from "react-router-dom";

const AccountActivation: React.FC = () => {

    const {checkAuth} = useAuth();
    const navigate = useNavigate();

    const [count, setCount] = useState<number>(4);
    const [activationMessage, setActivationMessage] = useState<string>("Account activation success - redirecting...");
    const [color, setColor] = useState<"bg-lime" | "bg-coolYellow">("bg-lime");
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token: string | null = urlParams.get('token');

        const activateAccount = async (token: string) => {
            try {
                const response = await api.get(`api/auth/activate`, {params: {token}});
                if (response.data === "Activation failed") {
                    setColor("bg-coolYellow");
                    setActivationMessage("Link has expired, register again please...");
                    setTimeout(() => {
                        navigate("/authenticate/register")
                    }, 4500)
                }
                setLoaded(true);
            } catch (error) {
                console.error("Error activating account: ", error);
            }
        };

        if (token) {
            activateAccount(token).then();
            setTimeout(async () => {
                await checkAuth();
            }, 4500)
        }
    }, [checkAuth, navigate]);   //gets token from url and activates account

    useEffect(() => {
        const interval: number = setInterval((): void => {
            setCount(c => {
                if (c > 0) return c - 1;
                clearInterval(interval)
                return c;
            });
        }, 1000)
        return () => clearInterval(interval)
    }, []);     //timer

    document.title = "CARSOLD | Account Activation";

    if (!loaded) {
        return null;
    }

    return (
        <div className={`flex flex-col gap-3 text-xl sm:text-5xl justify-center items-center h-screen`}>
            <div className={`absolute inset-0 animate-pulse z-0 ${color}`}></div>
            <div className="z-10">
                <p className="text-center">{activationMessage}</p>
                <p className="text-5xl sm:text-8xl font-bold font-mono text-center">{count}</p>
            </div>
        </div>
    );
}

export default AccountActivation