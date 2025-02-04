import React, {useEffect, useState} from "react";
import {AxiosError, AxiosResponse} from "axios";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import SessionExpiredBanner from "../../SharedComponents/Additional/Banners/SessionExpiredBanner.tsx";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";

const AuthErrorManager: React.FC = () => {

    const [showSessionExpired, setShowSessionExpired] = useState<boolean>(false);
    const {logout} = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.response.use((response: AxiosResponse) =>
                response, async (error: AxiosError) => {
                if (error.response && error.response.status === 401 || error.response && error.response.status === 403
                    || error.message.includes('Network Error') || error.message.includes('CORS')) {
                    console.error("Authentication error: " + error);
                    setShowSessionExpired(true);

                    setTimeout(async () => {
                        try {
                            await logout();
                            window.location.href = '/authenticate/login';
                        } catch (error) {
                            console.error("AuthErrorManager failed: ", error);
                        }
                    }, 2000);
                }

                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);

    }, []);  //sets interceptors and handles auth errors

    return (
        <>
            {showSessionExpired && <SessionExpiredBanner/>}
        </>
    );
}

export default AuthErrorManager;