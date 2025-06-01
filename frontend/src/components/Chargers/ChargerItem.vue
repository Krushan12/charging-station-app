<template>
  <div class="charger-card">
    <div class="charger-header">
      <h3>{{ charger.name }}</h3>
      <span :class="['status-badge', charger.status]">
        {{ charger.status }}
      </span>
    </div>
    <div class="charger-details">
      <p><strong>Type:</strong> {{ charger.connectorType }}</p>
      <p><strong>Location:</strong> {{ formatLocation(charger.location) }}</p>
      <p><strong>Power (kW):</strong> {{ charger.powerOutput }}</p>
    </div>
    <div class="charger-actions">
      <button @click="handleEdit" class="edit-btn">Edit</button>
      <button @click="handleDelete" class="delete-btn">Delete</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  charger: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const formatLocation = (location) => {
  if (!location || !location.coordinates) return 'N/A';
  const [longitude, latitude] = location.coordinates;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

const handleEdit = () => {
  emit('edit', props.charger._id);
};

const handleDelete = () => {
  emit('delete', props.charger._id);
};
</script>

<style scoped>
.charger-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

@media (max-width: 480px) {
  .charger-card {
    padding: 1rem;
  }
}

.charger-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.charger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .charger-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.charger-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.charger-details {
  margin: 1rem 0;
}

.charger-details p {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #4b5563;
  padding: 0.25rem 0;
}

@media (max-width: 480px) {
  .charger-details p {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.charger-details strong {
  color: #374151;
  font-weight: 500;
}

.charger-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 480px) {
  .charger-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

button {
  flex: 1;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background-color: #fbbf24;
  color: #92400e;
}

.edit-btn:hover {
  background-color: #f59e0b;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.delete-btn:hover {
  background-color: #dc2626;
}
</style>