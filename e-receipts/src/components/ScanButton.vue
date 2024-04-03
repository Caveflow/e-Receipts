<template>
    <div>
      <button @click="startScanner">Scan QR Code</button>
      <div id="reader" style="width: 500px; height: 300px;"></div>
    </div>
  </template>
  
  <script>
  import { Html5QrcodeScanner } from "html5-qrcode";
  
  export default {
    methods: {
      startScanner() {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: 250 },
          /* verbose= */ false
        );
        html5QrcodeScanner.render(
          (decodedText, decodedResult) => {
            // Do something with the decoded text
            console.log(`Decoded text: ${decodedText}`, decodedResult);
          },
          (errorMessage) => {
            console.error(errorMessage);
          }
        );
      }
    }
  };
  </script>
  