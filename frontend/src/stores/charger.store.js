import { defineStore } from 'pinia';
import apiClient from '../services/api.js';
import { ref } from 'vue';

export const useChargerStore = defineStore('charger', () => {
    const chargers = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filters = ref({
        status: '',
        type: '',
        location: ''
    });

    const fetchChargers = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/charging-stations');
            chargers.value = response.data.data;
        } catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch chargers';
        } finally {
            loading.value = false;
        }
    };

    const addCharger = async (chargerData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.post('/charging-stations', chargerData);
            chargers.value.push(response.data.data);
            return response.data.data;
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
            const response = await apiClient.put(`/charging-stations/${id}`, chargerData);
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
            return (
                (!filters.value.status || charger.status === filters.value.status) &&
                (!filters.value.type || charger.type === filters.value.type) &&
                (!filters.value.location || charger.location.toLowerCase().includes(filters.value.location.toLowerCase()))
            );
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
        filteredChargers,
        fetchChargersInRadius
    };
});