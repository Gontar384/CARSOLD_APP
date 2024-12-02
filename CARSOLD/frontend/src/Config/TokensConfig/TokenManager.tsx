import React, {useEffect, useState} from "react";
import {api} from "../AxiosConfig/AxiosConfig.tsx";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";

//fetches Csrf Token when app mounts
export const useFetchCsrf = () => {
    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const response = await api.get(`api/auth/csrf`);
                api.defaults.headers['X-CSRF-TOKEN'] = response.data.token;    //sets default axios header with csrf token
            } catch (error) {
                console.log("Error fetching csrf: ", error)
            }
        };
        fetchCsrf().then();
    }, [])
}

//refreshes and changes JWT token every 2 minutes
export const useRefreshJwt = () => {
    const {isAuthenticated} = useAuth();  //checks if user is authenticated
    useEffect(() => {
        const refreshInterval: number = setInterval(async () => {
            if (!isAuthenticated) return;
            try {
                await api.get(`api/auth/refresh`);
            } catch (error) {
                console.error("Error refreshing JWT token:", error);
            }
        }, 2 * 60 * 1000);
        return () => clearInterval(refreshInterval);
    }, [isAuthenticated]);
};

//tracks user activity and send keep-alive requests to server, one request on every minute
export const useTrackUserActivity = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        const events: string[] = ['click', 'mousemove', 'keydown', 'scroll'];
        const activityHandler = () => {
            if (isDisabled) return;
            setIsDisabled(true);
            try {
                api.get(`api/auth/keep-alive`);
            } catch (error) {
                console.error('Error refreshing session:', error);
            }
            setTimeout(() => {
                setIsDisabled(false);
            }, 60000);
        };
        events.forEach(event => window.addEventListener(event, activityHandler));
        return () => {
            events.forEach(event => window.removeEventListener(event, activityHandler));
        };
    }, [isDisabled]);
};

const TokenManager: React.FC = () => {
    useFetchCsrf();
    useRefreshJwt();
    useTrackUserActivity();
    return null;
}

export default TokenManager;
