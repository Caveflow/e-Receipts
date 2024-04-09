<template>
    <v-container>
      <!-- Button to toggle the QR scanner -->
      <v-btn @click="toggleScanner" prepend-icon="mdi-scan-helper">
        {{ scannerActive ? 'Stop Scanner' : 'Start Scanner' }}
      </v-btn>
  
      <!-- QR Code Scanner -->
      <qrcode-stream v-if="scannerActive" @decode="onDecode" @init="onInit"></qrcode-stream>
  
      <!-- Text field to display the decoded content -->
      <v-text-field
        label="Decoded content"
        :value="decodedContent"
        readonly
      ></v-text-field>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { QrcodeStream } from 'vue-qrcode-reader';
  
  // State to manage if the scanner is active
  const scannerActive = ref(false);
  const decodedContent = ref('');
  
  // Toggle the state of the scanner
  function toggleScanner() {
    scannerActive.value = !scannerActive.value;
  }
  
  function onDecode(content) {
    decodedContent.value = content;
    // Optionally stop the scanner after a successful decode
    scannerActive.value = false;
  }
  
  function onInit(promise) {
    promise.then(() => {
      console.log('QR scanner is ready!');
    }).catch(err => {
      console.error('QR scanner initialization failed: ', err);
    });
  }
  </script>
  
  