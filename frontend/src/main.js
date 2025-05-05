import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'

// Importa Axios
import axios from 'axios'

// Crea la aplicación Vue
const app = createApp(App)
app.use(createPinia());

// Usa el router en la aplicación
app.use(router)



// Proporciona Axios globalmente
app.provide('axios', axios)

// Monta la aplicación
app.mount('#app')