<template>
  <v-container>
    <v-card flat>
      <!-- Search Input -->
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-history"></v-icon> &nbsp;
        Find a receipt
        <v-spacer></v-spacer>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line clearable></v-text-field>
      </v-card-title>
      <v-divider></v-divider>
      <!-- Data Table -->
      <v-data-table item-key="id" show-select v-model="selected" :headers="headers" :items="items" :search
        class="elevation-1"></v-data-table>
      <v-btn class="mt-3" color="red" @click="deleteSelected">Delete Selected</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { ref as firebaseRef, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { db } from "../firebase.js";

const authStore = useAuthStore();
authStore.initializeAuth();
const userEmail = computed(() => authStore.userEmail);
const selected = ref([]); // Selected items
const search = ref(''); // Search query
const items = ref([]); // This will hold fetched data
const headers = ref([
  { title: 'QR-Code', sortable: true, value: 'qrcode' },
  { title: 'Remark', value: 'remark' },
  { title: 'Upload date', sortable: true, value: 'timestamp' }
]);

const deleteSelected = async () => {
  console.log("Selected items before deletion:", selected.value);  
  if (selected.value.length === 0) {
    alert("No items selected for deletion.");
    return;
  }
  const confirmDelete = confirm(`Are you sure you want to delete ${selected.value.length} items?`);
  if (!confirmDelete) return;

  await Promise.all(selected.value.map(itemId => {  // Directly use itemId since it's already the ID
    if (!itemId) {
      console.error("Error: itemId is undefined", itemId);
      return Promise.resolve();  // Skip this iteration
    }
    const itemRef = firebaseRef(db, `e-receipts/${itemId}`);
    return set(itemRef, null)  // Proper usage of 'set' to delete the item
      .then(() => console.log(`Deleted item with ID: ${itemId}`))
      .catch(error => console.error(`Error deleting item with ID: ${itemId}:`, error));
  }));
  selected.value = []; // Clear selection 
  await fetchItems(); 
};

// Fetch data from Firebase based on current user's email
const fetchItems = async () => {
  if (!userEmail) {
    console.log("No user or user email is logged in");
    return;  // Exit if no user is logged in or email is not available
  }
  //const userEmail = authStore.userEmail
  const dataRef = firebaseRef(db, 'e-receipts');
  const userQuery = query(dataRef, orderByChild('user'), equalTo(authStore.userEmail));

  get(userQuery).then((snapshot) => {
    if (snapshot.exists()) {
      items.value = Object.entries(snapshot.val()).map(([key, item]) => ({
        id: key,
        qrcode: item.qrcode,
        remark: item.remark,
        user: item.user,
        timestamp: new Date(item.timestamp).toLocaleString()
      }));
      console.log("Data fetched successfully for email:", userEmail);
    } else {
      items.value = [];  // Explicitly clear items if no data exists 
      console.log("No data available for the user with email:", userEmail);
    }
  }).catch((error) => {
    console.error("Firebase read error:", error);
    items.value = [];
  });
};

onMounted(() => {
  fetchItems();  // Initial fetch of data when component mounts
});
</script>
