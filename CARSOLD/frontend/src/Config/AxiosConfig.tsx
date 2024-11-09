import axios, {AxiosError, AxiosResponse} from 'axios';
import {useEffect, useState} from "react";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

let isCsrfFetched: boolean = false;

const fetchCsrf = async () => {
    if (isCsrfFetched) return;
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/csrf`, {
            withCredentials: true,
        });
        api.defaults.headers['X-CSRF-TOKEN'] = response.data.token;
        isCsrfFetched = true;
    } catch (error) {
        console.log("Error fetching csrf: ", error)
    }
}
fetchCsrf();

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                setTimeout(async ()=>{
                    await api.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/logout`)
                    window.location.href = '/authenticate';
                }, 2000);
            }
        } else if (error.message.includes('Network Error') || error.message.includes('CORS')) {
            setTimeout(async ()=>{
                await api.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/logout`)
                window.location.href = '/authenticate';
            }, 2000);
        }
        return Promise.reject(error);
    }
);

export const useTrackUserActivity = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const events = ['click', 'mousemove', 'keydown', 'scroll'];
        const activityHandler = () => {
            if (isDisabled) return;
            setIsDisabled(true);
            try {
                api.get(`${import.meta.env.VITE_BACKEND_URL}api/keep-alive`)
            } catch (error) {
                console.error('Error refreshing session:', error);
            }
            setTimeout(() => {
                setIsDisabled(false);
            }, 10000);
        };
        events.forEach((event) => {
            window.addEventListener(event, activityHandler);
        });
        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, activityHandler);
            });
        };
    }, [isDisabled]);
}

export default api