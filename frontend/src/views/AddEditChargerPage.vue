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
      </div>

      <div class="form-group">
        <label for="type">Charger Type</label>
        <select id="type" v-model="formData.type" required>
          <option value="">Select type</option>
          <option value="Level 1">Level 1</option>
          <option value="Level 2">Level 2</option>
          <option value="DC Fast">DC Fast</option>
        </select>
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
          <label for="power">Power (kW)</label>
          <input 
            type="number" 
            id="power" 
            v-model.number="formData.power" 
            required 
            min="0"
            step="0.1"
            placeholder="Enter power in kW"
          />
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

      <div v-if="chargerStore.error" class="error-message">
        {{ chargerStore.error }}
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
  type: '',
  location: '',
  power: 0,
  pricePerHour: 0,
  status: 'available'
});

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
    if (isEditMode.value) {
      await chargerStore.updateCharger(route.params.id, formData.value);
    } else {
      await chargerStore.addCharger(formData.value);
    }
    router.push('/');
  } catch (error) {
    console.error('Error saving charger:', error);
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
  margin-top: 1rem;
  text-align: center;
}
</style>