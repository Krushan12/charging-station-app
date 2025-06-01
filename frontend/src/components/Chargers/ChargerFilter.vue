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

    <div class="filter-group">
      <label for="power-filter">Power Output</label>
      <select id="power-filter" v-model="localFilters.power" class="form-select">
        <option 
          v-for="option in powerOptions" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
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

const powerOptions = [
  { value: '', label: 'All Power Outputs' },
  { value: 'low', label: 'Less than 20 kW' },
  { value: 'medium', label: '20-50 kW' },
  { value: 'high', label: 'More than 50 kW' }
];

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

// Watch for changes in initialFilters
watch(() => props.initialFilters, (newFilters) => {
  localFilters.value = {
    status: newFilters.status,
    type: newFilters.type,
    power: newFilters.power
  };
}, { deep: true });
</script>

<style scoped>
.charger-filter {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .charger-filter {
    flex-direction: column;
    gap: 1rem;
  }
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.form-select {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.form-select:hover {
  border-color: #d1d5db;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

@media (max-width: 480px) {
  .charger-filter {
    padding: 0.75rem;
  }

  .form-select {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}
</style>