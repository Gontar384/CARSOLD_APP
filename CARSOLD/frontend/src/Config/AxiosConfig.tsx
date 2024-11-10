import axios, {AxiosError, AxiosResponse} from 'axios';
import {useEffect} from "react";
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


