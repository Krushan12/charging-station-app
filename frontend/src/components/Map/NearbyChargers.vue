<template>
  <div class="nearby-chargers">
    <div class="header">
      <h3>Nearby Chargers</h3>
      <div class="distance-filter">
        <label>Within: </label>
        <select v-model="radius">
          <option value="1">1 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Finding nearby chargers...</p>
    </div>
    
    <div v-else-if="nearbyChargers.length === 0" class="no-results">
      No chargers found in this area
    </div>
    
    <div v-else class="chargers-list">
      <div 
        v-for="charger in nearbyChargers" 
        :key="charger._id"
        class="charger-item"
        :class="{ 'highlighted': highlightedChargerId === charger._id }"
        @mouseenter="$emit('highlight', charger._id)"
        @mouseleave="$emit('unhighlight')"
        @click="$emit('select', charger)"
      >
        <div class="status-indicator" :class="charger.status.toLowerCase()"></div>
        <div class="charger-info">
          <h4>{{ charger.name }}</h4>
          <p class="distance">{{ formatDistance(charger.distance) }}</p>
          <p class="details">
            {{ charger.connectorType }} · {{ charger.powerOutput }}kW
          </p>
          <p class="status">{{ charger.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  center: {
    type: Object,
    required: true
  },
  chargers: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  highlightedChargerId: {
    type: String,
    default: null
  }
});

const radius = ref(5);
const nearbyChargers = ref([]);

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

watch([() => props.center, () => props.chargers, radius], () => {
  if (!props.center || !props.chargers) return;
  
  nearbyChargers.value = props.chargers
    .map(charger => {
      const distance = calculateDistance(
        props.center.lat,
        props.center.lng,
        charger.location.coordinates[1],
        charger.location.coordinates[0]
      );
      return { ...charger, distance };
    })
    .filter(charger => charger.distance <= radius.value)
    .sort((a, b) => a.distance - b.distance);
}, { immediate: true });
</script>

<style scoped>
.nearby-chargers {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 300px;
  max-height: calc(100vh - 200px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  font-size: 16px;
}

.distance-filter select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.chargers-list {
  overflow-y: auto;
  padding: 8px;
}

.charger-item {
  display: flex;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.charger-item:hover,
.charger-item.highlighted {
  background-color: #f3f9fe;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 4px;
}

.status-indicator.available {
  background-color: #22c55e;
}

.status-indicator.occupied {
  background-color: #ef4444;
}

.status-indicator.maintenance {
  background-color: #f97316;
}

.charger-info {
  flex: 1;
}

.charger-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.distance {
  color: #666;
  font-size: 12px;
  margin: 0 0 4px 0;
}

.details {
  font-size: 13px;
  margin: 0 0 4px 0;
}

.status {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}

.loading {
  padding: 20px;
  text-align: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 8px;
  animation: spin 1s linear infinite;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
