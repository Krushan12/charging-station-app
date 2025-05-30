import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api', // Your backend API base URL [cite: 12]
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to add JWT token to requests
apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response Interceptor (optional, for handling global errors like 401)
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        const authStore = useAuthStore();
        authStore.logout(); // Logout user if unauthorized
        // Optionally redirect to login or show a message
    }
    return Promise.reject(error);
});

export default apiClient;