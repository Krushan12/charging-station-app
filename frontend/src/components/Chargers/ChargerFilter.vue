<template>
  <div class="charger-filter">
    <div class="filter-group">
      <label for="status-filter">Status:</label>
      <select id="status-filter" v-model="localFilters.status" class="form-select">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="type-filter">Connector Type:</label>
      <select id="type-filter" v-model="localFilters.type" class="form-select">
        <option value="">All Types</option>
        <option value="Level 1">Level 1</option>
        <option value="Level 2">Level 2</option>
        <option value="DC Fast">DC Fast</option>
      </select>
    </div>


  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['filter-changed']);

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      status: '',
      type: '',
      power: ''
    })
  }
});

const localFilters = ref({
  status: props.initialFilters.status,
  type: props.initialFilters.type,
  power: props.initialFilters.power
});

// Debounce the filter changes to prevent too many updates
let debounceTimer;
watch(localFilters, (newFilters) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('filter-changed', {
      status: newFilters.status,
      type: newFilters.type,
      power: newFilters.power
    });
  }, 300);
}, { deep: true });
</script>

<style scoped>
.charger-filter {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-select, .form-input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  color: #495057;
  background-color: white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-select:focus, .form-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

@media (max-width: 768px) {
  .charger-filter {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    margin-bottom: 0.5rem;
  }
}
</style>