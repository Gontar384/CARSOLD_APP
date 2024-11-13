import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';

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

