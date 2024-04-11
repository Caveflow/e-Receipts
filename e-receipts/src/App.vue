<template>
  <v-app id="receipt">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-avatar="/img/head.jpg" subtitle="E-Mail" title="User"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-home" title="Home" value=""></v-list-item>
        <v-list-item to="/qr-scanner" prepend-icon="mdi-qrcode-scan" title="QR Scanner" value=""></v-list-item>
        <v-list-item to="/library" prepend-icon="mdi-library" title="Library" value=""></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="5">
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

    <v-footer>
      <div class="px-4 py-2 text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Petja Hentschel</strong> — BSc (Hons) Computer Science
        <v-spacer></v-spacer>
        <v-btn v-for="icon in ficons" :key="icon.icon" :icon="icon.icon" size="small" variant="plain" :href="icon.url" target="_blank"></v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: null,
    ficons: [
      { icon: 'mdi-github', url: 'https://github.com/Caveflow/e-Receipts/' },
      { icon: 'mdi-cloud', url: 'https://cloud.pehe-it.de/' },
      { icon: 'mdi-school', url: 'https://wrexham.ac.uk/' },
    ],
  }),
};
</script>