<template>
    <v-table :items="decodedContents">
      <template v-slot:item.content="{ item }">
        <div>{{ item }}</div>
      </template>
    </v-table>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const decodedContents = computed(() => store.state.decodedContents);
  </script>
  