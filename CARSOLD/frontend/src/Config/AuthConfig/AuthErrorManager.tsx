import React, {useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import SessionExpiredBanner from "../../Additional/Banners/SessionExpiredBanner.tsx";

//manages unauthenticated errors with axios and logs out user
const AuthErrorManager: React.FC = () => {

    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);

    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {        //for authentication errors
                    setShowSessionExpired(true);        //displays banner
                    setTimeout(async () => {
                        await api.get(`api/auth/logout`)      //logout (deletes JWT)
                        window.location.href = '/authenticate/login';
                    }, 3000);
                }
            } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {  //for CORS errors
                setShowSessionExpired(true);
                setTimeout(async () => {
                    await api.get(`api/auth/logout`)
                    window.location.href = '/authenticate/login';
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