// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import QRScanner from '../components/QRScanner.vue'; 
import Library from '../components/Library.vue'; 
import HomePage from '../components/HomePage.vue'; 
import Login from '../components/Login.vue'; 
import Registration from '../components/Registration.vue'; 

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
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNavigation: true },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    meta: { hideNavigation: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
