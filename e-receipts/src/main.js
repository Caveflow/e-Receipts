/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.js';

// Router
import router from './router'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

// Use the router with the Vue application instance
app.use(router)

const pinia = createPinia();
app.use(pinia);
const authStore = useAuthStore();
authStore.initializeAuth();

registerPlugins(app)

// First, ensure the authentication is initialized
authStore.initializeAuth().then(() => {
    // Then wait for the router to be ready
    router.isReady().then(() => {
        app.mount('#app');  // Now, mount the app
    });
});