import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import ChargerListingPage from '../views/ChargerListingPage.vue'
import AddEditChargerPage from '../views/AddEditChargerPage.vue'
import MapViewPage from '../views/MapViewPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import { useAuthStore } from '../stores/auth.store' // We'll create this store

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresGuest: true } // For redirecting logged-in users from login page
    },
    {
        path: '/',
        name: 'ChargerList',
        component: ChargerListingPage,
        meta: { requiresAuth: true } // Protected route
    },
    {
        path: '/chargers/new',
        name: 'AddCharger',
        component: AddEditChargerPage,
        meta: { requiresAuth: true } // Protected route
    },
    {
        path: '/chargers/edit/:id', // Route param for charger ID
        name: 'EditCharger',
        component: AddEditChargerPage,
        props: true, // Pass route params as props to the component
        meta: { requiresAuth: true } // Protected route
    },
    {
        path: '/map',
        name: 'MapView',
        component: MapViewPage,
        meta: { requiresAuth: true } // Protected route [cite: 10]
    },
    {
        path: '/:pathMatch(.*)*', // Catch-all for 404
        name: 'NotFound',
        component: NotFoundPage
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Initialize store here, as it's outside a component
    const isAuthenticated = !!authStore.token; // Check if token exists

    if (to.meta.requiresAuth && !isAuthenticated) {
        // If route requires auth and user is not authenticated
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && isAuthenticated) {
        // If route is for guests (like login) and user is authenticated
        next({ name: 'ChargerList' }); // Redirect to a default authenticated page
    } else {
        // Otherwise, proceed
        next();
    }
});

export default router