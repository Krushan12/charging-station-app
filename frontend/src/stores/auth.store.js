import { defineStore } from 'pinia';
import apiClient from '../services/api.js';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        error: null,
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
        authError: (state) => state.error,
        isLoading: (state) => state.loading,
    },
    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.post('/auth/login', credentials);
                const { token } = response.data;
                
                this.token = token;
                localStorage.setItem('token', token);
                
                // Set the token in API client headers
                apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
                
                // Then fetch user data
                const userResponse = await apiClient.get('/auth/me');
                this.user = userResponse.data.data;
                localStorage.setItem('user', JSON.stringify(this.user));
                
                router.push('/');
            } catch (err) {
                this.error = err.response?.data?.error || 'Login failed';
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                this.loading = false;
            }
        },
        async signup(userData) {
            this.loading = true;
            this.error = null;
            try {
                await apiClient.post('/auth/register', userData);
                router.push({ name: 'Login', query: { registered: 'true' } });
            } catch (err) {
                this.error = err.response?.data?.message || 'Signup failed. Please try again.';
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push({ name: 'Login' });
        },
        initializeAuthHeader() {
            if (this.token) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            }
        }
    },
});