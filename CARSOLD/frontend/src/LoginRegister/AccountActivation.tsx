import {ReactElement, useEffect, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from "../RouterConfig/AxiosConfig.tsx";
import {AxiosResponse} from "axios";

//page only used when activating account through email
function AccountActivation(): ReactElement {

    const navigate: NavigateFunction = useNavigate();
    const [count, setCount] = useState<number>(5);

    const url = `${import.meta.env.VITE_BACKEND_URL}api/auth/activate`;

    //after navigation occurs, fetch token from url and sends it to backend, activating account
    //also gets cookie with token, resulting in user authentication, then navigates to /home
    useEffect((): void => {
        const urlParams = new URLSearchParams(window.location.search);
        const token: string | null = urlParams.get('token');

        const activateAccount = async (token: string): Promise<void> => {
            try {
                const response: AxiosResponse = await axios.get(`${url}`, {
                    params: {token},
                    withCredentials: true,
                });
                if (response.data) {
                    console.log("Account activated", response.data);
                }
            } catch (error) {
                console.error("Error activating account: ", error);
            }

        };
        if (token) {
            activateAccount(token).then(()=>{
                setTimeout((): void => {
                    navigate("/home");
                }, 5500)
            });
        }
    }, [navigate]);

    //timer
    useEffect((): () => void => {
        const interval: number = setInterval((): void => {
            setCount(c => {
                if (c > 0) return c - 1;
                clearInterval(interval)
                return c;
            });
        }, 1000)
        return (): void => clearInterval(interval)
    }, []);

//test
    return (
        <div className="flex flex-col gap-3 text-xl sm:text-5xl justify-center items-center h-screen bg-lowLime">
            <p className="text-center">Your account is active!</p>
            <p className="mb-8 text-center">Going to home page....</p>
            <p className="text-5xl sm:text-8xl font-bold font-mono text-center">{count}</p>
        </div>
    );
}

export default AccountActivation