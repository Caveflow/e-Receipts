<template>
    <div>
      <v-img class="mx-auto my-6" max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img>
  
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
  
        <v-text-field density="compact" v-model="email" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
          variant="outlined"></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
  
          <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
            Forgot login password?</a>
        </div>
  
        <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          density="compact" v-model="password" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
          @click:append-inner="visible = !visible"></v-text-field>
  
        <v-btn type="submit" block class="mb-3" color="blue" size="large" variant="tonal">
          Sign In
        </v-btn>

        <v-btn @click="signInWithGoogle" prepend-icon="mdi-google" type="submit" block class="mb-4" color="blue" size="large" variant="tonal">
            Sign In with Google
        </v-btn>

        <v-card-text class="text-center">
          <a class="text-blue text-decoration-none" href="/registration" rel="noopener noreferrer" target="_blank">
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const email = ref('');
const password = ref('');
const visible = ref(false);

const login = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Logged in successfully!");
        // Navigate to another route or update the UI accordingly
    } catch (error) {
        console.error("Failed to login:", error.message);
    }
};

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        console.log("Google sign in successful!");
        // Handle navigation or UI update
    } catch (error) {
        console.error("Google sign in failed:", error.message);
    }
};
</script>