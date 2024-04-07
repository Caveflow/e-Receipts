<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list-item title="Menu"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="QR Scanner"></v-list-item>
      <v-list-item link title="Library"></v-list-item>
    </v-navigation-drawer>

    <v-app-bar :elevation="5">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>

      <template v-slot:append>

        <v-btn icon="mdi-magnify"></v-btn>

      </template>
    </v-app-bar>

    <v-main>
      <!--  -->
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {
  data: () => ({ 
    drawer: null,
    items: [
        {
          title: 'QR Scanner', icon: 'mdi-qrcode-scan',
        },
        {
          title: 'Library', icon: 'mdi-library',
        },
      ],
  }),
}
</script>