<template>
    <v-container>
        <v-timeline align="start" justify="auto">
            <v-timeline-item v-for="(item, i) in items" :key="i" :dot-color="item.color" :icon="item.icon" fill-dot>
                <v-card hover max-width="495">
                    <v-card-title :class="['text-h6', `bg-${item.color}`]">
                        {{ item.title }}
                    </v-card-title>
                    <v-card-text class="bg-white text--primary">
                        <p class="ma-3" v-html="item.text"></p>
                        <v-btn v-if="item.btn" :color="item.color" variant="outlined" @click="navigate(item.path)">
                            {{item.btn}}
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const items = ref([
    {
        color: 'red-lighten-2',
        icon: 'mdi-scanner',
        title: 'I. Scan',
        text: 'Start by scanning a QR code on a digital receipt. <strong>Automatic Capture</strong> is enabled, so the scanner will automatically detect and process the QR code. There is no need to click or press any buttons.',
        btn: 'Start',
        path: '/qr-scanner',
    },
    {
        color: 'blue-grey',
        icon: 'mdi-cogs',
        title: 'II. Process',
        text: 'No interaction needed, the system will automatically process the barcode and save the receipt-id to the online database.',
        showButton: false,
    },
    {
        color: 'teal-lighten-2',
        icon: 'mdi-folder-account',
        title: 'III. Organise',
        text: 'The saved receipts are displayed in a table for easy management and organisation.',
        btn: 'Show',
        path: '/library',
    },
    {
        color: 'indigo-lighten-2',
        icon: 'mdi-handshake',
        title: 'IV. Feedback',
        text: 'The following survey helps to improve the application and enables a better understanding of user behaviour.',
        btn: 'continue',
        path: 'https://cloud.pehe-it.de/apps/forms/s/PitApeX852dH7aLHB7miQfKe',
    },
]);

const router = useRouter(); // Get the router instance

const navigate = (path) => {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        window.open(path, '_blank'); // Open external URLs in a new tab
    } else {
        router.push(path); // Internal navigation for Vue Router paths
    }
};
</script>