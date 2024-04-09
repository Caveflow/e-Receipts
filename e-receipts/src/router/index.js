// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import QRScanner from '../components/QRScanner.vue'; 
import Library from '../components/Library.vue'; 
import HomePage from '../components/HomePage.vue'; 

const routes = [
  {
    path: '/qr-scanner',
    name: 'QRScanner',
    component: QRScanner,
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
  },
  {
    path: '/', // Root path
    name: 'Home',
    component: HomePage, // Component to render for the root path
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
