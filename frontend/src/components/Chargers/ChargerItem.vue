<template>
  <div class="charger-card">
    <div class="charger-header">
      <h3>{{ charger.name }}</h3>
      <span :class="['status-badge', charger.status]">
        {{ charger.status }}
      </span>
    </div>
    <div class="charger-details">
      <p><strong>Type:</strong> {{ charger.type }}</p>
      <p><strong>Location:</strong> {{ charger.location }}</p>
      <p><strong>Power (kW):</strong> {{ charger.power }}</p>
      <p><strong>Price:</strong> ${{ charger.pricePerHour }}/hour</p>
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

const handleEdit = () => {
  emit('edit', props.charger._id);
};

const handleDelete = () => {
  emit('delete', props.charger._id);
};
</script>

<style>
.charger-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.charger-card:hover {
  transform: translateY(-2px);
}

.charger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.charger-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.available {
  background-color: #d4edda;
  color: #155724;
}

.status-badge['in-use'] {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.maintenance {
  background-color: #f8d7da;
  color: #721c24;
}

.charger-details {
  margin-bottom: 1rem;
}

.charger-details p {
  margin: 0.5rem 0;
}

.charger-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>