<template>
  <div class="login-container">
    <div class="auth-card">
      <div class="tabs">
        <button 
          @click="activeTab = 'login'" 
          :class="{ 'active': activeTab === 'login' }"
        >
          Login
        </button>
        <button 
          @click="activeTab = 'signup'" 
          :class="{ 'active': activeTab === 'signup' }"
        >
          Sign Up
        </button>
      </div>

      <form @submit.prevent="handleSubmit" v-if="activeTab === 'login'">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginForm.email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password" 
            required 
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" class="primary" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="authStore.authError" class="error-message">
          {{ authStore.authError }}
        </p>
      </form>

      <form @submit.prevent="handleSignup" v-else>
        <div class="form-group">
          <label for="signup-name">Name</label>
          <input 
            type="text" 
            id="signup-name" 
            v-model="signupForm.name" 
            required 
            placeholder="Enter your name"
          />
        </div>
        <div class="form-group">
          <label for="signup-email">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            v-model="signupForm.email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            v-model="signupForm.password" 
            required 
            placeholder="Enter your password"
            minlength="6"
          />
        </div>
        <button type="submit" class="primary" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Creating account...' : 'Sign Up' }}
        </button>
        <p v-if="authStore.authError" class="error-message">
          {{ authStore.authError }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const activeTab = ref('login');

const loginForm = ref({
  email: '',
  password: ''
});

const signupForm = ref({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  await authStore.login(loginForm.value);
};

const handleSignup = async () => {
  await authStore.signup(signupForm.value);
};

// If coming from registration with query param
if (route.query.registered) {
  activeTab.value = 'login';
  loginForm.value.email = route.query.email || '';
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tabs button {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #666;
  position: relative;
}

.tabs button.active {
  color: #007bff;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}
</style>