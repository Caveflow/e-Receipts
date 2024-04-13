<template>
    <div>
        <v-img class="mx-auto my-6" max-width="228"
            src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"></v-img>

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field density="compact" v-model="email" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined" required></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" v-model="password" placeholder="Set your new password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                required></v-text-field>

            <v-btn type="submit" block class="mb-3" color="blue" size="large" variant="tonal" @click="register">
                Sign Up
            </v-btn>

        </v-card>

        <!-- Snackbar for messages -->
        <v-snackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const visible = ref(false);
const router = useRouter();
// Snackbar
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');

const register = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log("Registration successful, user:", userCredential.user);
        snackbarText.value = "Registration successful! Redirection in 3 seconds.";
        snackbarColor.value = "green";
        showSnackbar.value = true;
        setTimeout(() => router.push('/login'), 3000); // Wait for 3 seconds, then redirect to login
    } catch (error) {
        snackbarText.value = "Registration failed: " + error.message;
        snackbarColor.value = "red";
        showSnackbar.value = true;
        console.error("Registration failed:", error.message);
    }
};
</script>