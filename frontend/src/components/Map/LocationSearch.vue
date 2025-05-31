<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        placeholder="Search location..."
        class="search-input"
      />
      <div v-if="loading" class="search-spinner"></div>
    </div>
    
    <div v-if="suggestions.length > 0" class="suggestions">
      <div
        v-for="suggestion in suggestions"
        :key="suggestion.place_id"
        class="suggestion-item"
        @click="selectLocation(suggestion)"
      >
        {{ suggestion.display_name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import debounce from 'lodash/debounce';

const emit = defineEmits(['select']);
const searchQuery = ref('');
const suggestions = ref([]);
const loading = ref(false);

const searchLocation = debounce(async (query) => {
  if (!query.trim()) {
    suggestions.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    suggestions.value = await response.json();
  } catch (error) {
    console.error('Search failed:', error);
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
}, 300);

const handleInput = () => {
  searchLocation(searchQuery.value);
};

const selectLocation = (suggestion) => {
  searchQuery.value = suggestion.display_name;
  emit('select', {
    lat: parseFloat(suggestion.lat),
    lng: parseFloat(suggestion.lon),
    name: suggestion.display_name
  });
  suggestions.value = [];
};
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  padding: 0 12px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2196f3;
}

.search-spinner {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

@keyframes spin {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}
</style>
