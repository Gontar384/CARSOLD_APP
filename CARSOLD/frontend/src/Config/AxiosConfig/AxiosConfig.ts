import axios, {AxiosInstance} from 'axios';

//creates custom axios instance for requests
export const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});
