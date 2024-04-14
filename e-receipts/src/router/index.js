// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
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
    meta: { requiresAuth: true },
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
    meta: { requiresAuth: true },
  },
  {
    path: '/', // Root path
    name: 'Home',
    component: HomePage, // Component to render for the root path
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { hideNavigation: true, requiresUnauth: true },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    meta: { hideNavigation: true, requiresUnauth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthReady) {
    // Ensure auth is initialized if not already done
    authStore.initializeAuth().then(() => {
      proceedWithNavigation(to, next, authStore);
    });
  } else {
    proceedWithNavigation(to, next, authStore);
  }
});

function proceedWithNavigation(to, next, authStore) {
  const isAuthenticated = authStore.isAuthenticated;

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');  // Not authenticated, redirect to login
  } else if (to.matched.some(record => record.meta.requiresUnauth) && isAuthenticated) {
    next('/');  // Authenticated, but tries to access login/signup, redirect to home
  } else {
    next();  // Continue with the navigation as per normal
  }
}

export default router;
