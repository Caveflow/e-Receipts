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
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { ref as firebaseRef, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from "../firebase.js";

const authStore = useAuthStore();
authStore.initializeAuth();
const userEmail = computed(() => authStore.userEmail);
const search = ref(''); // Search query
const items = ref([]); // This will hold fetched data
const headers = ref([
  { title: 'Receipt-ID', sortable: true, value: 'qrcode' },
  { title: 'User', value: 'user' },
  { title: 'Upload date', sortable: true, value: 'timestamp' }
]);

// Fetch data from Firebase based on current user's email
onMounted(() => {
  if (!userEmail) {
    console.log("No user or user email is logged in");
    return;  // Exit if no user is logged in or email is not available
  }
  //const userEmail = authStore.userEmail
  const dataRef = firebaseRef(db, 'contents');
  const userQuery = query(dataRef, orderByChild('user'), equalTo(authStore.userEmail));

  get(userQuery).then((snapshot) => {
    if (snapshot.exists()) {
      items.value = Object.values(snapshot.val()).map((item) => ({
        qrcode: item.qrcode,
        user: item.user,
        timestamp: new Date(item.timestamp).toLocaleString()
      }));
      console.log("Data fetched successfully for email:", userEmail);
    } else {
      console.log("No data available for the user with email:", userEmail);
    }
  }).catch((error) => {
    console.error("Firebase read error:", error);
  });
});
</script>
