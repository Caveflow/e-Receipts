<template>
  <v-app id="receipt">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-avatar="/img/head_petja.jpg" subtitle="S22015437" title="Petja"></v-list-item>
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
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {  
  name: 'App',
  data() {
    return {
      drawer: null,
    };
  },
};
</script>