<template>
  <v-app id="receipt">
    <v-navigation-drawer v-model="drawer" app v-if="!hideNavigation">
      <v-list>
        <v-list-item prepend-avatar="/img/head.jpg" :subtitle="authStore.userEmail" title="User"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-home" title="Home" value=""></v-list-item>
        <v-list-item to="/qr-scanner" prepend-icon="mdi-qrcode-scan" title="QR Scanner" value=""></v-list-item>
        <v-list-item to="/library" prepend-icon="mdi-library" title="My receipts" value=""></v-list-item>
        <v-list-item @click="signOut" prepend-icon="mdi-logout" title="Sign out" value=""></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="5" v-if="!hideNavigation">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Receipt Hub</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-form-select" href="https://cloud.pehe-it.de/apps/forms/s/PitApeX852dH7aLHB7miQfKe"
          target="_blank"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <!-- Router View -->
      <router-view></router-view>
    </v-main>
    <v-divider></v-divider>
    <v-footer v-if="!hideNavigation">
      <div class="px-4 py-2 text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Petja Hentschel</strong> — BSc (Hons) Computer Science
        <v-spacer></v-spacer>
        <v-btn v-for="icon in ficons" :key="icon.icon" :icon="icon.icon" size="small" variant="plain" :href="icon.url"
          target="_blank"></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth.js';

const drawer = ref(null)
const route = useRoute()
const router = useRouter()

const hideNavigation = computed(() => {
  return route.meta.hideNavigation
})

const authStore = useAuthStore();
authStore.initializeAuth();

const signOut = async () => {
  try {
    await authStore.signOut();  // Ensure sign out completes
    router.push('/login');      // Then redirect to login
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const ficons = ref([
  { icon: 'mdi-github', url: 'https://github.com/Caveflow/e-Receipts/' },
  { icon: 'mdi-cloud', url: 'https://cloud.pehe-it.de/' },
  { icon: 'mdi-school', url: 'https://wrexham.ac.uk/' },
]);
</script>