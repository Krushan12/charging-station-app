<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">EV Charger Manager</router-link>
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        <i :class="['fas', isMenuOpen ? 'fa-times' : 'fa-bars']"></i>
      </button>
    </div>
    <div class="navbar-links" :class="{ 'active': isMenuOpen }">
      <router-link to="/" @click="isMenuOpen = false">Chargers</router-link>
      <router-link to="/map" @click="isMenuOpen = false">Map View</router-link>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth.store';

const authStore = useAuthStore();
const isMenuOpen = ref(false);

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
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-brand a {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .navbar-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #007bff;
    padding: 1rem;
    gap: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .navbar-links.active {
    display: flex;
  }
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