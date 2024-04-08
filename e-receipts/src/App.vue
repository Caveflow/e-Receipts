<template>
  <v-app id="receipt">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item prepend-avatar="/img/head_petja.jpg" subtitle="S22015437" title="Petja"></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item @click="toggleScanner" prepend-icon="mdi-qrcode-scan" title="QR Scanner" value=""></v-list-item>
        <v-list-item prepend-icon="mdi-library" title="Library" value=""></v-list-item>
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
      <!-- Conditionally display the QR scanner -->
      <v-container v-if="showScanner">
        <QrcodeStream @decode="onDecode" @init="onInit" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
import { QrcodeStream } from 'vue-qrcode-reader';

export default {
  components: {
    QrcodeStream,
  },
  data() {
    return {
      drawer: null,
      showScanner: false, // Controls the visibility of the QR scanner
    };
  },
  methods: {
    toggleScanner() {
      this.showScanner = !this.showScanner;
    },
    onDecode(content) {
      console.log(content);
      // Handle the decoded content here
      this.showScanner = false; // Optionally hide the scanner after decoding
    },
    onInit(promise) {
      promise.then(() => {
        console.log('QR scanner is ready!');
      }).catch(error => {
        console.error('QR scanner error:', error);
      });
    }
  },
};
</script>