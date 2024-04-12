<template>
  <v-container>
    <!-- Button to toggle the QR scanner -->
    <v-btn @click="toggleScanner" prepend-icon="mdi-scan-helper" class="mb-3">
      {{ scannerActive ? 'Stop Scanner' : 'Start Scanner' }}
    </v-btn>

    <!-- QR Code Scanner -->
    <qrcode-stream v-if="scannerActive" @detect="onDetect" :track="paintOutline" @error="onError"></qrcode-stream>
    <v-row v-else>
      <v-col cols="6">
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>

    <!-- QR Code Reader via file browser >
    <qrcode-capture @detect="onDetect"></qrcode-capture -->

    <v-row>
      <v-col class="d-flex align-center" cols="8">
        <!-- d-flex to display elements inline and align-center for vertical alignment -->
        <v-text-field ref="textFieldRef" label=" Decoded content" :value="decodedContent" readonly></v-text-field>
        <v-btn color="primary" @click="storeContent" :disabled="!decodedContent || isSaving" class="ml-3">{{ isSaving ?
          'Saving...' : 'Save' }}</v-btn>
      </v-col>
    </v-row>

    <!-- Snackbar for success message -->
    <v-snackbar v-model="showSnackbar" :timeout="2000" color="green">
      The QR code has been successfully saved in the database!
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
import { ref as dbRef, set, push, getDatabase } from 'firebase/database';
import { db } from "../firebase.js";

// State to manage if the scanner is active
const scannerActive = ref(false);

const decodedContent = ref('');
const showSnackbar = ref(false);

// Watch the decodedContent for changes
// Focus and highlight the text field when decodedContent gets a value
const textFieldRef = ref(null);
watch(decodedContent, (newValue) => {
  if (newValue && textFieldRef.value) {
    textFieldRef.value.focus();
  }
});

// Toggle the state of the scanner
function toggleScanner() {
  scannerActive.value = !scannerActive.value;
}

function onDetect(content) {
  try {
    const data = JSON.parse(JSON.stringify(content)); // Ensuring it's parsed as JSON
    if (data.length > 0 && data[0].rawValue) {
      decodedContent.value = data[0].rawValue; // Extracting rawValue from the first item
      console.log("Decoded content:", decodedContent.value); // Log to verify
    } else {
      console.error('No data found or rawValue is missing');
    }
  } catch (error) {
    console.error('Error parsing QR data:', error);
  }
  scannerActive.value = false; // Optionally stop the scanner after a successful decode
}

// paintOutline function to draw the outline of the detected QR code in red
function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

// Error handling
const error = ref('')

function onError(err) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    error.value +=
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    error.value += err.message
  }
}

// Function to store content in Realtime Database
const isSaving = ref(false);
const storeContent = async () => {
  if (!decodedContent.value) {
    console.error('No content to save');
    return; // Exit if there's no content to store
  }

  isSaving.value = true;  // Indicate that saving is in progress
  const postListRef = dbRef(db, 'contents');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    qrcode: decodedContent.value,  // Use the actual value of decodedContent
    user: "John Doe",
    timestamp: Date.now()
  })
    .then(() => {
      console.log("Content stored successfully");
      decodedContent.value = '';  // Clear the input field after successful storage
      isSaving.value = false;  // Reset saving indicator
      showSnackbar.value = true;  // Show the snackbar when content is successfully stored
    })
    .catch((error) => {
      console.error("Error storing content: ", error);
      isSaving.value = false;
    });
};
</script>