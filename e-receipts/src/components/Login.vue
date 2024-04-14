<template>
    <div>
        <v-img class="mx-auto my-6" max-width="228"
            src=""></v-img>

        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field density="compact" v-model="email" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined" required></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password

                <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer"
                    target="_blank">
                    Forgot login password?</a>
            </div>

            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" v-model="password" placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                required></v-text-field>

            <v-btn @click="login" type="submit" block class="mb-3" color="blue" size="large" variant="tonal">
                Sign In
            </v-btn>

            <v-btn @click="signInWithGoogle" prepend-icon="mdi-google" type="submit" block class="mb-4" color="blue"
                size="large" variant="tonal">
                Sign In with Google
            </v-btn>

            <v-card-text class="text-center">
                <a class="text-blue text-decoration-none" href="/registration" rel="noopener noreferrer"
                    target="_blank">
                    Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>

        <!-- Snackbar for messages -->
        <v-snackbar v-model="showSnackbar" :timeout="2000" :color="snackbarColor">
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const email = ref('');
const password = ref('');
const visible = ref(false);
const router = useRouter();
const authStore = useAuthStore();

// Snackbar
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');

const login = async () => {
    try {
        await authStore.login(email.value, password.value);
        snackbarText.value = "Sign in successful! Redirection in 2 seconds.";
        snackbarColor.value = "green";
        showSnackbar.value = true;
        setTimeout(() => router.push('/'), 2000); // Wait for 2 seconds, then redirect to login
    } catch (error) {
        snackbarText.value = "Sign in failed: " + error.message;
        snackbarColor.value = "red";
        showSnackbar.value = true;
    }
};

const signInWithGoogle = async () => {
    try {
        await authStore.signInWithGoogle();
        snackbarText.value = "Google sign in successful! Redirection in 2 seconds.";
        snackbarColor.value = "green";
        showSnackbar.value = true;
        setTimeout(() => router.push('/'), 2000); // Wait for 2 seconds, then redirect to login
    } catch (error) {
        console.error("Google sign in failed:", error.message);
        snackbarText.value = "Google sign in failed: " + error.message;
        snackbarColor.value = "red";
        showSnackbar.value = true;
    }
};
</script>