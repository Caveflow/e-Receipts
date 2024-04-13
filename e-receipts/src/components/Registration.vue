<template>
    <v-container>
      <v-form @submit.prevent="register">
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary">Register</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase.js';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  
  const email = ref('');
  const password = ref('');
  
  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      console.log("Registration successful, user:", userCredential.user);
      // Optional: Redirect to login page or home page
    } catch (error) {
      console.error("Registration failed:", error.message);
      // Handle errors like email already in use, password too weak, etc.
    }
  };
  </script>
  