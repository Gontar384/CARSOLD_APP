import axios, {AxiosError, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";
import {useAuth} from "./AuthProvider.tsx";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                setTimeout(async () => {
                    await api.get(`api/auth/logout`)
                    window.location.href = '/authenticate';
                }, 2000);
            }
        } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
            setTimeout(async () => {
                await api.get(`api/auth/logout`)
                window.location.href = '/authenticate';
            }, 2000);
        }
        return Promise.reject(error);
    }
);

//custom hook to fetch Csrf Token
export const useFetchCsrf = () => {
    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const response = await api.get(`api/auth/csrf`);
                api.defaults.headers['X-CSRF-TOKEN'] = response.data.token;
            } catch (error) {
                console.log("Error fetching csrf: ", error)
            }};
        fetchCsrf();
    },[])
}

// Custom hook to refresh JWT token every 5 minutes
export const useRefreshJwt = () => {
    const {isAuthenticated} = useAuth();
    useEffect(() => {
        const refreshInterval = setInterval(async () => {
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

// Custom hook to track user activity and send keep-alive requests
export const useTrackUserActivity = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        const events = ['click', 'mousemove', 'keydown', 'scroll'];
        const activityHandler = () => {
            if (isDisabled) return;
            setIsDisabled(true);
            try {
                api.get(`api/auth/keep-alive`);
                console.log("Session refreshed");
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

