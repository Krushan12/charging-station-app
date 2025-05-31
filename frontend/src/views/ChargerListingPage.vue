<template>
  <div class="charger-listing">
    <div class="header">
      <h1>EV Chargers</h1>
      <router-link to="/chargers/new" class="add-btn">
        Add New Charger
      </router-link>
    </div>

    <ChargerFilter 
      @filter-changed="handleFilterChange" 
      :initial-filters="chargerStore.filters"
    />

    <div v-if="chargerStore.loading" class="loading">
      <span class="loading-spinner"></span>
      Loading chargers...
    </div>
    <div v-else-if="chargerStore.error" class="error">
      {{ chargerStore.error }}
    </div>
    <div v-else-if="filteredChargers.length === 0" class="no-results">
      <p>No chargers found matching your filters.</p>
      <button class="clear-filters-btn" @click="clearFilters" v-if="hasActiveFilters">
        Clear Filters
      </button>
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
import { computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useChargerStore } from '../stores/charger.store';
import ChargerItem from '../components/Chargers/ChargerItem.vue';
import ChargerFilter from '../components/Chargers/ChargerFilter.vue';

const router = useRouter();
const chargerStore = useChargerStore();

onMounted(() => {
  chargerStore.fetchChargers();
});

const filteredChargers = computed(() => {
  return chargerStore.filteredChargers();
});

const hasActiveFilters = computed(() => {
  const filters = chargerStore.filters;
  return filters.status !== '' || filters.type !== '' || filters.power !== '';
});

const handleFilterChange = (filters) => {
  chargerStore.filters = filters;
};

const clearFilters = () => {
  // Update the store filters
  chargerStore.filters = {
    status: '',
    type: '',
    power: ''
  };
  
  // Force a re-render of the filter component by updating the key
  nextTick(() => {
    handleFilterChange(chargerStore.filters);
  });
};

const handleEdit = (id) => {
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error {
  color: #dc3545;
}

.clear-filters-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-filters-btn:hover {
  background-color: #5a6268;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.charger-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>