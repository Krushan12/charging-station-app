<template>
  <div class="map-page">
    <div class="search-box">
      <div class="search-container">
        <LocationSearch @select="handleLocationSelect" class="location-search" />
        <ChargerSearch @select="handleChargerSelect" class="charger-search" />
      </div>
    </div>
    <div id="leaflet-map"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useChargerStore } from '../stores/charger.store';
import LocationSearch from '../components/Map/LocationSearch.vue';
import ChargerSearch from '../components/Map/ChargerSearch.vue';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
});

const chargerStore = useChargerStore();
let map = null;

const handleLocationSelect = ({ lat, lng }) => {
  if (map) {
    map.setView([lat, lng], 13);
  }
};

const handleChargerSelect = ({ lat, lng, charger }) => {
  if (map) {
    map.setView([lat, lng], 15);
    // Find and open the popup for this charger
    const layers = Object.values(map._layers);
    const marker = layers.find(layer => {
      if (layer instanceof L.Marker) {
        const position = layer.getLatLng();
        return position.lat === lat && position.lng === lng;
      }
      return false;
    });
    if (marker) {
      marker.openPopup();
    }
  }
};

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

onMounted(() => {
  // Initialize the map only if it doesn't exist
  if (!map) {
    map = L.map('leaflet-map', {
      center: [20.5937, 78.9629], // India center
      zoom: 5
    });

    // Add tile layer with English labels using OSM Carto
    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      subdomains: 'abc'
    }).addTo(map);
  }

  // Load chargers
  chargerStore.fetchChargers().then(() => {
    chargerStore.chargers.forEach(charger => {
      if (charger.location?.coordinates) {
        const [lng, lat] = charger.location.coordinates;
        
        // Create a status color class based on charger status
        const statusClass = charger.status.toLowerCase().replace(/\s+/g, '-');
        
        // Create popup content with rich formatting
        const popupContent = `
          <div class="charger-popup">
            <h3>${charger.name}</h3>
            <div class="charger-popup-status ${statusClass}">
              ${charger.status}
            </div>
            <div class="charger-popup-details">
              <p><strong>Type:</strong> ${charger.connectorType}</p>
              <p><strong>Power Output:</strong> ${charger.powerOutput} kW</p>
            </div>
          </div>
        `;
        
        L.marker([lat, lng])
          .bindPopup(popupContent)
          .addTo(map);
      }
    });
  });
});
</script>

<style>
.map-page {
  position: relative;
  height: calc(100vh - 88px);
  margin: 12px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .map-page {
    margin: 8px;
    height: calc(100vh - 72px);
  }
}

.search-box {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #edf2f7;
  z-index: 1000;
}

@media (max-width: 768px) {
  .search-box {
    padding: 12px;
  }
}

.search-container {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

@media (max-width: 640px) {
  .search-container {
    flex-direction: column;
    gap: 8px;
  }
}

.search-container > * {
  flex: 1;
}

#leaflet-map {
  flex: 1;
  width: 100%;
  z-index: 1;
  background: #f8fafc;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  transition: all 0.3s ease;
}

/* Override Leaflet's default popup styling */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.leaflet-popup-content {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.4;
}

/* Custom popup styling */
.charger-popup h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #111827;
}

.charger-popup-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 12px;
}

.charger-popup-status.active {
  background-color: #d1fae5;
  color: #065f46;
}

.charger-popup-status.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.charger-popup-details p {
  margin: 6px 0;
  color: #4b5563;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.charger-popup-details strong {
  color: #374151;
  font-weight: 600;
}

/* Style the zoom controls */
.leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  margin: 16px !important;
}

.leaflet-control-zoom a {
  background-color: white !important;
  color: #374151 !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  border-radius: 6px !important;
  border: 1px solid #e5e7eb !important;
  transition: all 0.2s ease !important;
}

.leaflet-control-zoom a:hover {
  background-color: #f9fafb !important;
  color: #111827 !important;
  border-color: #d1d5db !important;
}
</style>