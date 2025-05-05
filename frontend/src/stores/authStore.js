// stores/authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {jwtDecode} from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);

  // Decodificar el token si existe al iniciar
  if (token.value) {
    try {
      user.value = jwtDecode(token.value);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      token.value = null;
      localStorage.removeItem('token');
    }
  }

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken) {
    try {
      const decoded = jwtDecode(newToken);
      token.value = newToken;
      user.value = decoded;
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Token inválido:', error);
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    logout,
  };
});
