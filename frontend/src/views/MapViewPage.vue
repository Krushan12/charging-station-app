<template>
  <div class="map-view">
    <h1>Charger Map View</h1>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChargerStore } from '../stores/charger.store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const chargerStore = useChargerStore();
const mapContainer = ref(null);
let map = null;
let markers = [];

// Initialize map
onMounted(async () => {
  await chargerStore.fetchChargers();
  initMap();
});

// Watch for charger changes
watch(() => chargerStore.chargers, (newChargers) => {
  updateMarkers(newChargers);
}, { deep: true });

const initMap = () => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([51.505, -0.09], 13); // Default to London
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    updateMarkers(chargerStore.chargers);
  }
};

const updateMarkers = (chargers) => {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Add new markers
  chargers.forEach(charger => {
    // For simplicity, using random coordinates if not provided
    // In a real app, you'd want geocoding or actual coordinates
    const lat = charger.lat || 51.505 + (Math.random() - 0.5) * 0.1;
    const lng = charger.lng || -0.09 + (Math.random() - 0.5) * 0.1;
    
    const marker = L.marker([lat, lng]).addTo(map)
      .bindPopup(`<b>${charger.name}</b><br>${charger.location}<br>Type: ${charger.type}<br>Status: ${charger.status}`);
    
    markers.push(marker);
  });

  // Fit map to markers if we have any
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  }
};
</script>

<style scoped>
.map-view {
  padding: 2rem;
}

.map-container {
  height: 600px;
  width: 100%;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }
}
</style>