<template>
  <div class="charger-listing">
    <div class="header">
      <h1>EV Chargers</h1>
      <router-link to="/chargers/new" class="add-btn">
        Add New Charger
      </router-link>
    </div>

    <ChargerFilter @filter-changed="handleFilterChange" />

    <div v-if="chargerStore.loading" class="loading">
      Loading chargers...
    </div>
    <div v-else-if="chargerStore.error" class="error">
      {{ chargerStore.error }}
    </div>
    <div v-else-if="filteredChargers.length === 0" class="no-results">
      No chargers found.
    </div>
    <div v-else class="charger-grid">
      <ChargerItem 
        v-for="charger in filteredChargers" 
        :key="charger._id" 
        :charger="charger"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useChargerStore } from '../stores/charger.store';
import ChargerItem from '../components/Chargers/ChargerItem.vue';
import ChargerFilter from '../components/Chargers/ChargerFilter.vue';

const chargerStore = useChargerStore();

onMounted(() => {
  chargerStore.fetchChargers();
});

const filteredChargers = computed(() => {
  return chargerStore.filteredChargers();
});

const handleFilterChange = (filters) => {
  chargerStore.filters = filters;
};

const handleEdit = (id) => {
  // Navigate to edit page
  router.push({ name: 'EditCharger', params: { id } });
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this charger?')) {
    await chargerStore.deleteCharger(id);
  }
};
</script>

<style scoped>
.charger-listing {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-btn {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.add-btn:hover {
  background-color: #0069d9;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

.charger-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>