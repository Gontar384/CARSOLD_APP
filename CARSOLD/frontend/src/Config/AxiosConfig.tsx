import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";
import {useAuth} from "./AuthProvider.tsx";

//creates custom axios instance for requests
export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,      //default URL
    withCredentials: true                           //cookies available
});

//to handle errors and redirect unauthenticated user
//to /authenticate and log them out
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {        //for authentication errors
                setTimeout(async () => {
                    await api.get(`api/auth/logout`)
                    window.location.href = '/authenticate';
                }, 1000);
            }
        } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {  //for CORS errors
            setTimeout(async () => {
                await api.get(`api/auth/logout`)
                window.location.href = '/authenticate';
            }, 1000);
        }
        return Promise.reject(error);
    }
);

//custom hook to fetch Csrf Token when app mounts
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
        fetchCsrf();
    }, [])
}

//custom hook to refresh and change JWT token every 2 minutes
export const useRefreshJwt= () => {
    const {isAuthenticated} = useAuth();  //checks if user is authenticated
    useEffect(() => {
        const refreshInterval: number = setInterval(async ()=> {
            if (!isAuthenticated) return;
            try {
                await api.get(`api/auth/refresh`);
            } catch (error) {
                console.error("Error refreshing JWT token:", error);
            }
        }, 2 * 60 * 1000);
        return ()=> clearInterval(refreshInterval);
    }, [isAuthenticated]);
};

//custom hook to track user activity and send keep-alive requests to server,
//one request available every minute
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

