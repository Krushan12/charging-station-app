import { defineStore } from 'pinia';
import apiClient from '../services/api.js';
import { ref } from 'vue';

export const useChargerStore = defineStore('charger', () => {
    const chargers = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filters = ref({
        status: '',
        power: '',
        type: ''
    });

    const fetchChargers = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/charging-stations');
            chargers.value = response.data.data || [];
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch chargers';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const addCharger = async (chargerData) => {
        loading.value = true;
        error.value = null;
        try {
            console.log('Store received data:', chargerData);
            const formattedData = {
                ...chargerData,
                powerOutput: Number(chargerData.powerOutput),
                location: {
                    type: 'Point',
                    coordinates: chargerData.location.coordinates.map(Number)
                }
            };
            console.log('Store sending data:', formattedData);

            const response = await apiClient.post('/charging-stations', formattedData);
            const newCharger = response.data.data;
            chargers.value.push(newCharger);
            return newCharger;
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to add charger';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateCharger = async (id, chargerData) => {
        loading.value = true;
        error.value = null;
        try {
            // Format the data before sending
            const formattedData = {
                ...chargerData,
                powerOutput: Number(chargerData.powerOutput),
                location: chargerData.location.coordinates 
                    ? {
                        type: 'Point',
                        coordinates: chargerData.location.coordinates.map(Number)
                      }
                    : chargerData.location // Use the location as is if no coordinates
            };

            const response = await apiClient.put(`/charging-stations/${id}`, formattedData);
            const index = chargers.value.findIndex(c => c._id === id);
            if (index !== -1) {
                chargers.value[index] = response.data.data;
            }
            return response.data.data;
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to update charger';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteCharger = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await apiClient.delete(`/charging-stations/${id}`);
            chargers.value = chargers.value.filter(c => c._id !== id);
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to delete charger';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchChargersInRadius = async (lat, lng, distance) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get(`/charging-stations/radius/${lat}/${lng}/${distance}`);
            chargers.value = response.data.data;
            return response.data.data;
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch nearby chargers';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const filteredChargers = () => {
        return chargers.value.filter(charger => {
            // Status filter
            if (filters.value.status && charger.status !== filters.value.status) {
                return false;
            }

            // Type filter
            if (filters.value.type && charger.connectorType !== filters.value.type) {
                return false;
            }

            // Power output filter
            if (filters.value.power) {
                const power = Number(charger.powerOutput);
                switch (filters.value.power) {
                    case 'low':
                        if (power >= 20) return false;
                        break;
                    case 'medium':
                        if (power < 20 || power > 50) return false;
                        break;
                    case 'high':
                        if (power <= 50) return false;
                        break;
                }
            }

            return true;
        });
    };

    return {
        chargers,
        loading,
        error,
        filters,
        fetchChargers,
        addCharger,
        updateCharger,
        deleteCharger,
        fetchChargersInRadius,
        filteredChargers
    };
});