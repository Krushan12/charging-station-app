import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import base styles
import './assets/main.css'

// Import Leaflet styles
import 'leaflet/dist/leaflet.css'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')