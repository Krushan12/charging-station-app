import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', { 
        url: config.url, 
        method: config.method, 
        data: config.data,
        headers: config.headers 
    });
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;