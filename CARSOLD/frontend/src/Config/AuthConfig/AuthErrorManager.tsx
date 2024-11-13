import {useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import SessionExpiredBanner from "../../Banners/SessionExpiredBanner.tsx";
import {api} from "../AxiosConfig/AxiosConfig.tsx";

//to manage unauthenticated errors with axios, logout user and redirect him to /authenticate
const AuthErrorManager = () => {
    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);

    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {        //for authentication errors
                    setShowSessionExpired(true);        //displays banner
                    setTimeout(async () => {
                        await api.get(`api/auth/logout`)      //logout (deletes JWT)
                        window.location.href = '/authenticate';
                    }, 3000);
                }
            } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {  //for CORS errors
                setShowSessionExpired(true);           //displays banner
                setTimeout(async () => {
                    await api.get(`api/auth/logout`)     //logout (deletes JWT)
                    window.location.href = '/authenticate';
                }, 3000);
            }
            return Promise.reject(error);
        }
    );
    return (
        <>
            {showSessionExpired && <SessionExpiredBanner/>} {/*displays banner*/}
        </>
    );
}

export default AuthErrorManager;