import {useEffect, useState} from "react";
import {api} from "../AxiosConfig/AxiosConfig.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import {getCsrfToken, getJwtRefreshed, getSessionActive} from "../../ApiCalls/Service/UserService.ts";

//fetches Csrf Token when app mounts
export const useFetchCsrf = () => {
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const response = await getCsrfToken();
                api.defaults.headers['X-CSRF-TOKEN'] = response.data.token;
            } catch (error) {
                console.error("Error fetching csrf: ", error)
                delete api.defaults.headers['X-CSRF-TOKEN'];
            }
        };

        fetchCsrf();
    }, [isAuthenticated])
}

//refreshes and changes JWT token every 2 minutes
export const useRefreshJwt = () => {
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const refreshJwt = async () => {
            if (isAuthenticated) {
                try {
                    await getJwtRefreshed();
                } catch (error) {
                    console.error("Error refreshing JWT token: ", error);
                }
            }
        };

        let interval: NodeJS.Timeout | null = null;

        if (isAuthenticated) {
            refreshJwt();
            interval = setInterval(refreshJwt, 2 * 60 * 1000);
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
        const activityHandler = async () => {
            if (isDisabled) return;
            setIsDisabled(true);
            try {
                await getSessionActive();
            } catch (error) {
                console.error('Error refreshing session:', error);
            }
            setTimeout(() => setIsDisabled(false), 60000);
        };
        events.forEach(event => window.addEventListener(event, activityHandler));

        return () => {
            events.forEach(event => window.removeEventListener(event, activityHandler));
        };
    }, [isDisabled]);
};