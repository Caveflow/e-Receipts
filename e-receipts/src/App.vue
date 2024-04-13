<template>
  <v-app id="receipt">
    <v-navigation-drawer v-model="drawer" app v-if="!hideNavigation">
      <v-list>
        <v-list-item prepend-avatar="/img/head.jpg" :subtitle="userEmail" title="User"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-home" title="Home" value=""></v-list-item>
        <v-list-item to="/qr-scanner" prepend-icon="mdi-qrcode-scan" title="QR Scanner" value=""></v-list-item>
        <v-list-item to="/library" prepend-icon="mdi-library" title="Library" value=""></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="5" v-if="!hideNavigation">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Application</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-magnify"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <!-- Router View -->
      <router-view></router-view>
    </v-main>

    <v-footer v-if="!hideNavigation">
      <div class="px-4 py-2 text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Petja Hentschel</strong> — BSc (Hons) Computer Science
        <v-spacer></v-spacer>
        <v-btn v-for="icon in ficons" :key="icon.icon" :icon="icon.icon" size="small" variant="plain" :href="icon.url" target="_blank"></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { auth } from './firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

const drawer = ref(null)
const route = useRoute()
const userEmail = ref(null) // Reactive reference for user email

const hideNavigation = computed(() => {
  return route.meta.hideNavigation
})

const ficons = ref([
  { icon: 'mdi-github', url: 'https://github.com/Caveflow/e-Receipts/' },
  { icon: 'mdi-cloud', url: 'https://cloud.pehe-it.de/' },
  { icon: 'mdi-school', url: 'https://wrexham.ac.uk/' },
]);

// Monitor auth state changes
onMounted(() => {
  onAuthStateChanged(auth, user => {
    if (user) {
      userEmail.value = user.email // Update userEmail when user is logged in
    } else {
      userEmail.value = null // Clear userEmail when user is logged out
    }
  })
})
</script>