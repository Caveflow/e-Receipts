<template>
  <v-sheet border>
    <v-container>
      <!-- Button Row for Scanner and Save -->
      <v-row justify="center">
        <v-col class="text-center">
          <v-btn class="ma-3" @click="toggleScanner" size="large" color="primary" prepend-icon="mdi-scan-helper">
            {{ scannerActive ? 'Stop Scanner' : 'Start Scanner' }}
          </v-btn>
          <v-btn class="ma-3" color="green" @click="storeContent" size="large" :disabled="!decodedContent || isSaving">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Input Fields and Save Button -->
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-text-field placeholder="Scan to see the content of the QR code" :value="decodedContent" ref="textFieldRef"
            readonly variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Remark" placeholder="Enter a remark (optional)" variant="outlined" v-model="remark"
            clearable></v-text-field>
        </v-col>
      </v-row>
      <!-- QR Code Scanner and Placeholder for When Inactive -->
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-sheet class="d-flex align-center justify-center" style="min-height: 400px;">
            <!-- Adjust height as needed -->
            <qrcode-stream v-if="scannerActive" @detect="onDetect" :track="paintOutline"
              @error="onError"></qrcode-stream>
            <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
            <div v-else class="text-center">Activate the scanner to view here.</div>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- Snackbar for Success Message -->
      <v-snackbar v-model="showSnackbar" :timeout="2000" color="green">
        The QR code has been successfully saved in the database!
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-sheet>
</template>


<script setup>
import { ref, watch } from 'vue';
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
import { ref as dbRef, set, push, getDatabase } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from "../firebase.js";

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
const remark = ref('');
const currentUser = ref(null);  // Reactive reference for the current user

// Monitor auth state and update currentUser
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = user;  // Store the user object in a reactive ref
  } else {
    currentUser.value = null;  // Clear the user ref if logged out
  }
});

const storeContent = async () => {
  if (!decodedContent.value || !currentUser.value) {
    console.error('No content to save or user not logged in');
    return; // Exit if there's no content to store
  }

  isSaving.value = true;  // Indicate that saving is in progress
  const postListRef = dbRef(db, 'e-receipts');
  const newPostRef = push(postListRef);
  set(newPostRef, {
    qrcode: decodedContent.value,  // Use the actual value of decodedContent
    remark: remark.value,
    user: currentUser.value.email,
    timestamp: Date.now()
  })
    .then(() => {
      console.log("Content stored successfully");
      decodedContent.value = '';  // Clear the input field after successful storage
      remark.value = '';  // Clear the remark field
      isSaving.value = false;  // Reset saving indicator
      showSnackbar.value = true;  // Show the snackbar when content is successfully stored
    })
    .catch((error) => {
      console.error("Error storing content: ", error);
      isSaving.value = false;
    });
};
</script>