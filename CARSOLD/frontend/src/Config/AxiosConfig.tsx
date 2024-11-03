import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true // Ensure cookies are sent with requests
});

// Retrieve and set the CSRF token from cookies
api.interceptors.request.use(async (config) => {
    const response = await axios.get('http://localhost:8080/api/auth/csrf', {
        withCredentials: true
    });
    config.headers['X-CSRF-TOKEN'] = response.data.token;
    return config;
});

export default api;