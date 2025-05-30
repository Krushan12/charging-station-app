import { defineStore } from 'pinia';
import apiClient from '../services/api.js';
import router from '../router'; // To navigate after login/logout

// Define the backend API URL from environment variables or hardcode for now
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api'; // Adjust if your backend runs elsewhere

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
                // As per assignment: Login API (Issue JWT token) [cite: 6]
                const response = await apiClient.post(`${BACKEND_URL}/auth/login`, credentials);
                const { token, user } = response.data; // Assuming backend returns token and user info

                this.token = token;
                this.user = user;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set auth header for subsequent requests

                router.push({ name: 'ChargerList' }); // Navigate to charger list page
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed. Please check your credentials.';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.token = null;
                this.user = null;
            } finally {
                this.loading = false;
            }
        },
        async signup(userData) {
            this.loading = true;
            this.error = null;
            try {
                // As per assignment: Register (Signup) API [cite: 6]
                await axios.post(`${BACKEND_URL}/auth/register`, userData);
                // Optionally log the user in directly after signup or redirect to login
                // For now, let's assume they need to login after signup
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
            delete axios.defaults.headers.common['Authorization'];
            router.push({ name: 'Login' });
        },
        // Action to initialize auth header if token exists on page load
        initializeAuthHeader() {
            if (this.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            }
        }
    },
});