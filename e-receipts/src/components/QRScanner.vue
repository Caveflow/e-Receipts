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
      <v-col cols="6"> <!-- grid/flexbox -->
        <!-- Text field to display the decoded content -->
        <v-text-field ref="textFieldRef" label=" Decoded JSON content" :value="decodedContent" readonly></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';

// State to manage if the scanner is active
const scannerActive = ref(false);
const decodedContent = ref('');

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
  decodedContent.value = JSON.stringify(content);
  // this.$store.commit('addDecodedContent', content);
  // Optionally stop the scanner after a successful decode
  scannerActive.value = false;
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

</script>