// src/stores/auth.js
import { defineStore } from 'pinia';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    isAuthReady: false  // Indicates if the auth state has been initialized
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user ? state.user.email : null
  },
  actions: {
    setUser(payload) {
      this.user = payload;
    },
    async login(email, password) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        this.setUser(res.user);
        return res;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        this.setUser(res.user);
        return res;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    async signOut() {
      await auth.signOut();
      this.setUser(null);
    },
    initializeAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.setUser(user);
          this.isAuthReady = true;
          resolve(user);
        });
      });
    }
  }
});
