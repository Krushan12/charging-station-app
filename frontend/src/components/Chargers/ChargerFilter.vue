<template>
  <div class="charger-filter">
    <div class="filter-group">
      <label for="status-filter">Status:</label>
      <select id="status-filter" v-model="localFilters.status">
        <option value="">All Statuses</option>
        <option value="available">Available</option>
        <option value="in-use">In Use</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="type-filter">Type:</label>
      <select id="type-filter" v-model="localFilters.type">
        <option value="">All Types</option>
        <option value="Level 1">Level 1</option>
        <option value="Level 2">Level 2</option>
        <option value="DC Fast">DC Fast</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="location-filter">Location:</label>
      <input 
        type="text" 
        id="location-filter" 
        v-model="localFilters.location" 
        placeholder="Filter by location"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['filter-changed']);

const localFilters = ref({
  status: '',
  type: '',
  location: ''
});

watch(localFilters, (newFilters) => {
  emit('filter-changed', newFilters);
}, { deep: true });
</script>

<style scoped>
.charger-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

select, input {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .charger-filter {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>