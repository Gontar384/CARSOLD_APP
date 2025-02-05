import React, {useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import SessionExpiredBanner from "../../SharedComponents/Additional/Banners/SessionExpiredBanner.tsx";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";

const AuthErrorManager: React.FC = () => {

    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);
    const {handleLogout} = useAuth();

    const isAuthenticationRequest = (url: string | undefined): boolean => {
        if (!url) return false;
        return url.toLowerCase().includes('api/auth/authenticate');
    };

    const handleError = () => {
        setShowSessionExpired(true);

        setTimeout(async () => {
            try {
                await handleLogout();
                window.location.href = '/authenticate/login';
            } catch (error) {
                console.error("AuthErrorManager failed: ", error);
            }
        }, 2000);
    }

    useEffect(() => {
        const interceptor = api.interceptors.response.use((response: AxiosResponse) => response, async (error: AxiosError) => {
            if (error.response) {
                const status = error.response.status;
                const requestUrl = error.config?.url;

                if (isAuthenticationRequest(requestUrl)) return Promise.reject(error);

                if (status === 401) {
                    handleError();
                    console.error("Unauthorized, problem with request, cookie or JWT: ", error);
                } else if (status === 403) {
                    handleError();
                    console.error("Forbidden, probably CSRF token expired (session expired): ", error);
                } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
                    handleError();
                    console.error("Network or CORS problem: ", error);
                }
            }
            return Promise.reject(error);
        });
        return () => api.interceptors.response.eject(interceptor);
    }, []);  //sets interceptors and handles auth errors

    return (
        <>
            {showSessionExpired && <SessionExpiredBanner/>}
        </>
    );
}

export default AuthErrorManager;