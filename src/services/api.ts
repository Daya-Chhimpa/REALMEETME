import axios from 'axios';

const BASE_URL = 'https://realmeet.feelinghub.in/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Sometimes servers block default axios user agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-api-key': 'realmeet_sjhdfgusgydiadihiuacequyvuvy',
    },
});

// Request interceptor to log outgoing requests
api.interceptors.request.use(
    config => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        console.log('Headers:', config.headers);
        console.log('Data:', config.data);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    },
);

// Response interceptor to log responses
api.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        console.log('Data:', response.data);
        return response;
    },
    error => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        console.error('API Response Config:', error.config);
        return Promise.reject(error);
    },
);

export default api;
