import React, {useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import SessionExpiredBanner from "../../SharedComponents/Additional/Banners/SessionExpiredBanner.tsx";

const AuthErrorManager: React.FC = () => {

    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);

    const handleError = () => {
        setShowSessionExpired(true);  // banner
        console.error("Authentication error occurred");

        setTimeout(async () => {
            try {
                await api.get(`api/auth/logout`);
                window.location.href = '/authenticate/login';
            } catch (error) {
                console.error("Error handler failed: ", error);
            }
        }, 3000);
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use((response: AxiosResponse) =>
            response, async (error: AxiosError) => {
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {  //for authentication errors
                        handleError();
                    }
                } else if (
                    error.message.includes('Network Error') || error.message.includes('CORS')) {  //for CORS errors
                    handleError();
                }

                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);

    }, []);  //sets interceptors and handles authentication errors

    return (
        <>
            {showSessionExpired && <SessionExpiredBanner/>}
        </>
    );
}

export default AuthErrorManager;