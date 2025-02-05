import {useEffect, useState} from "react";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import {getCsrfToken, refreshJwt, keepSessionAlive} from "../../ApiCalls/Service/UserService.ts";

//fetches Csrf Token when app mounts
export const useFetchCsrf = () => {
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const handleGetCsrfToken = async () => {
            try {
                const response = await getCsrfToken();
                api.defaults.headers['X-CSRF-TOKEN'] = response.data.token;
            } catch (error) {
                console.error("Error fetching csrf: ", error)
                delete api.defaults.headers['X-CSRF-TOKEN'];
            }
        };

        handleGetCsrfToken();
    }, [isAuthenticated])
}

//refreshes and changes JWT token every 2 minutes
export const useRefreshJwt = () => {
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const handleRefreshJwt = async () => {
            if (isAuthenticated) {
                try {
                    await refreshJwt();
                } catch (error) {
                    console.error("Error refreshing JWT token: ", error);
                }
            }
        };

        let interval: NodeJS.Timeout | null = null;

        if (isAuthenticated) {
            handleRefreshJwt();
            interval = setInterval(handleRefreshJwt, 2 * 60 * 1000);
        }

        return () => {
            if (interval) clearInterval(interval)
        };
    }, [isAuthenticated]);
};

//tracks user activity and send keep-alive requests to server, one request on every minute
export const useTrackUserActivity = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const events: string[] = ['click', 'mousemove', 'keydown', 'scroll'];
        const handleKeepSessionAlive = async () => {
            if (isDisabled) return;
            setIsDisabled(true);
            try {
                await keepSessionAlive();
            } catch (error) {
                console.error('Error refreshing session:', error);
            }
            setTimeout(() => setIsDisabled(false), 60000);
        };
        events.forEach(event => window.addEventListener(event, handleKeepSessionAlive));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleKeepSessionAlive));
        };
    }, [isDisabled]);
};