import React, {useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import SessionExpiredBanner from "../../Additional/Banners/SessionExpiredBanner.tsx";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";

const AuthErrorManager: React.FC = () => {

    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);
    const {handleLogout} = useAuth();

    const isAuthenticationRequest = (url: string | undefined): boolean => {
        if (!url) return false;
        const paths = ['api/public/auth/authenticate', 'api/private/user/delete', 'api/private/user/changePassword'];
        return paths.some(path => url.startsWith(path))
    };

    const isOfferModificationRequest = (url: string | undefined): boolean => {
        if (!url) return false;
        const paths = ['api/private/offer/add', 'api/private/offer/update', 'api/private/userProfilePic/upload'];
        return paths.some(path => url.startsWith(path))
    };

    const handleAuthError = () => {
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

                if (status === 401 || status === 403) {
                    handleAuthError();
                    console.error("Unauthorized, problem with request, cookie or JWT: ", error);
                }
            } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                const requestUrl = error.config?.url;
                if (isOfferModificationRequest(requestUrl)) return Promise.reject(error);
                handleAuthError();
                console.error("Network error or server unreachable.", error);
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