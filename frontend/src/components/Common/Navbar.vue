<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">EV Charger Manager</router-link>
    </div>
    <div class="navbar-links">
      <router-link to="/">Chargers</router-link>
      <router-link to="/map">Map View</router-link>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth.store';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand a {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar-links a:hover {
  text-decoration: underline;
}

.logout-btn {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>