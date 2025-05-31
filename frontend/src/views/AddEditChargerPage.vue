<template>
  <div class="charger-form-page">
    <h1>{{ isEditMode ? 'Edit Charger' : 'Add New Charger' }}</h1>
    
    <form @submit.prevent="handleSubmit" class="charger-form">
      <div class="form-group">
        <label for="name">Charger Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required 
          placeholder="Enter charger name"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="connectorType">Connector Type</label>
        <select id="connectorType" v-model="formData.connectorType" required>
          <option disabled value="">Select type</option>
          <option value="Level 1">Level 1</option>
          <option value="Level 2">Level 2</option>
          <option value="DC Fast">DC Fast</option>
        </select>
        <span v-if="errors.connectorType" class="error-message">{{ errors.connectorType }}</span>
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input 
          type="text" 
          id="location" 
          v-model="formData.location" 
          required 
          placeholder="Enter location"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="powerOutput">Power Output (kW)</label>
          <input 
            type="number" 
            id="powerOutput" 
            v-model.number="formData.powerOutput" 
            required 
            min="1"
            step="0.1"
            placeholder="Enter power in kW"
          />
          <span v-if="errors.powerOutput" class="error-message">{{ errors.powerOutput }}</span>
        </div>

        <div class="form-group">
          <label for="price">Price per Hour ($)</label>
          <input 
            type="number" 
            id="price" 
            v-model.number="formData.pricePerHour" 
            required 
            min="0"
            step="0.01"
            placeholder="Enter price per hour"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="latitude">Latitude</label>
          <input 
            type="number" 
            id="latitude" 
            v-model.number="formData.latitude" 
            required 
            step="any"
            min="-90"
            max="90"
            placeholder="Enter latitude"
          />
        </div>
        <div class="form-group">
          <label for="longitude">Longitude</label>
          <input 
            type="number" 
            id="longitude" 
            v-model.number="formData.longitude" 
            required 
            step="any"
            min="-180"
            max="180"
            placeholder="Enter longitude"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="formData.status" required>
          <option value="available">Available</option>
          <option value="in-use">In Use</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="chargerStore.loading">
          {{ chargerStore.loading ? 'Saving...' : isEditMode ? 'Update Charger' : 'Add Charger' }}
        </button>
        <router-link to="/" class="cancel-btn">Cancel</router-link>
      </div>

      <div v-if="errors.serverError || chargerStore.error" class="error-message">
        {{ errors.serverError || chargerStore.error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChargerStore } from '../stores/charger.store';

const route = useRoute();
const router = useRouter();
const chargerStore = useChargerStore();

const isEditMode = computed(() => route.name === 'EditCharger');

const formData = ref({
  name: '',
  connectorType: 'Level 1', // Set default value
  location: '',
  powerOutput: 1, // Set minimum valid value
  pricePerHour: 0,
  status: 'available',
  latitude: 0,
  longitude: 0
});

const errors = ref({});

const validateForm = () => {
  errors.value = {};
  
  if (!formData.value.name?.trim()) {
    errors.value.name = 'Please provide a name for the charging station';
  }
  
  if (!formData.value.connectorType) {
    errors.value.connectorType = 'Please select a connector type';
  }
  
  if (!formData.value.powerOutput || formData.value.powerOutput < 1) {
    errors.value.powerOutput = 'Power output must be at least 1 kW';
  }
  
  return Object.keys(errors.value).length === 0;
};

onMounted(async () => {
  if (isEditMode.value) {
    // If editing, fetch the charger data
    const chargerId = route.params.id;
    await chargerStore.fetchChargers();
    const charger = chargerStore.chargers.find(c => c._id === chargerId);
    if (charger) {
      formData.value = { ...charger };
    }
  }
});

const handleSubmit = async () => {
  try {
    errors.value = {}; // Clear previous errors
    
    if (!validateForm()) {
      return;
    }

    // Convert and validate power output
    const powerOutput = Number(formData.value.powerOutput);
    if (isNaN(powerOutput) || powerOutput < 1) {
      errors.value.powerOutput = 'Power output must be at least 1 kW';
      return;
    }

    // Validate connector type
    if (!['Level 1', 'Level 2', 'DC Fast'].includes(formData.value.connectorType)) {
      errors.value.connectorType = 'Please select a valid connector type';
      return;
    }

    const chargerData = {
      name: formData.value.name.trim(),
      powerOutput: powerOutput,
      connectorType: formData.value.connectorType,
      status: formData.value.status.toLowerCase(),
      location: {
        type: 'Point',
        coordinates: [Number(formData.value.longitude), Number(formData.value.latitude)]
      }
    };

    console.log('Prepared charger data:', chargerData);

    console.log('Submitting charger data:', chargerData);

    if (isEditMode.value) {
      await chargerStore.updateCharger(route.params.id, chargerData);
    } else {
      await chargerStore.addCharger(chargerData);
    }
    router.push('/');
  } catch (error) {
    console.error('Error saving charger:', error.response?.data || error);
  }
};
</script>

<style scoped>
.charger-form-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.charger-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0069d9;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #6c757d;
  border-radius: 4px;
  color: #6c757d;
  text-decoration: none;
}

.cancel-btn:hover {
  background-color: #f8f9fa;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>