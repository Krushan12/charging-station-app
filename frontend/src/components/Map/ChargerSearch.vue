<template>
  <div class="charger-search">
    <div class="search-input-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search for chargers by name or type..."
        class="search-input"
      />
      <i class="fas fa-search search-icon"></i>
    </div>
    <div v-if="showResults && filteredChargers.length > 0" class="search-results">
      <div
        v-for="charger in filteredChargers"
        :key="charger._id"
        class="search-result-item"
        @click="selectCharger(charger)"
      >
        <div class="result-name">{{ charger.name }}</div>
        <div class="result-details">
          <span :class="['status-badge', charger.status]">{{ charger.status }}</span>
          <span>{{ charger.connectorType }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChargerStore } from '../../stores/charger.store';

const chargerStore = useChargerStore();
const searchQuery = ref('');
const showResults = ref(false);

const filteredChargers = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return chargerStore.chargers.filter(charger => 
    charger.name.toLowerCase().includes(query) ||
    charger.connectorType.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  showResults.value = searchQuery.value.length > 0;
};

const selectCharger = (charger) => {
  if (charger.location?.coordinates) {
    const [lng, lat] = charger.location.coordinates;
    emit('select', { lat, lng, charger });
  }
  searchQuery.value = '';
  showResults.value = false;
};

const emit = defineEmits(['select']);
</script>

<style scoped>
.charger-search {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background-color: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f9fafb;
}

.result-name {
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
}

.result-details {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.available {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.in-use {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.maintenance {
  background-color: #f8d7da;
  color: #721c24;
}
</style>]]>
