import axios from 'axios';

axios.defaults.withCredentials = true;          // Enable sending cookies with requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export default axios;