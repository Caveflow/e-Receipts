<template>
  <v-container>
    <v-card flat>
      <!-- Search Input -->
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-history"></v-icon> &nbsp;
        Find a receipt
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line></v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <!-- Data Table -->
      <v-data-table :headers="headers" :items="items" :search class="elevation-1"></v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ref as firebaseRef, get } from 'firebase/database';
import { db } from "../firebase.js";

const search = ref(''); // Search query
const items = ref([]); // This will hold fetched data
const headers = ref([
  { title: 'QR Code', sortable: true, value: 'qrcode' },
  { title: 'User', value: 'user' },
  { title: 'Upload date', sortable: true, value: 'timestamp' }
]);

// Fetch data from Firebase
onMounted(() => {
  const dataRef = firebaseRef(db, 'contents');
  get(dataRef).then((snapshot) => {
    if (snapshot.exists()) {
      items.value = Object.values(snapshot.val()).map((item, index) => ({
        id: index,
        qrcode: item.qrcode,
        user: item.user,
        timestamp: new Date(item.timestamp).toLocaleString()
      }));
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error("Firebase read error:", error);
  });
});
</script>
