import axios from 'axios';

// Create an axios instance with common configuration
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetcher = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('payload');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Import homework API directly
import homeworkApi from './homework.api';
export { homeworkApi };

export default api;