<template>
  <div id="app-container">
    <Navbar v-if="showNavbar" />
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Common/Navbar.vue';
import { useAuthStore } from './stores/auth.store.js'; // Import the auth store

const route = useRoute();
const authStore = useAuthStore();

// Only show navbar if user is authenticated and not on the login page
const showNavbar = computed(() => {
  return authStore.isAuthenticated && route.name !== 'Login';
});
</script>

<style>
/* Global styles or import a framework like Tailwind CSS */
/* For simplicity, let's add some basic styling */
body {
  font-family: sans-serif;
  margin: 0;
  background-color: #f4f7f6;
  color: #333;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main.container {
  flex-grow: 1;
}

/* Basic button styling */
button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 5px;
}

button.primary {
  background-color: #007bff;
  color: white;
}

button.secondary {
  background-color: #6c757d;
  color: white;
}

button.danger {
  background-color: #dc3545;
  color: white;
}

/* Basic form styling */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
</style>