/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Router
import router from './router'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

// Use the router with the Vue application instance
app.use(router)

registerPlugins(app)

// Mount the app to the DOM
app.mount('#app')