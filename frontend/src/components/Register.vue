<template>
    <div>
      <h2>registrate y octen una esperiencia completa</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="nombre_usuario" type="text" placeholder="Nombre de Usuario" required />
        <input v-model="contraseña" type="password" placeholder="Contraseña" required />
        <button type="submit">REGISTRAR</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    data() {
      return {
        nombre_usuario: '',
        contraseña: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await axios.post('/api/auth/register', {
            nombre_usuario: this.nombre_usuario,
            contraseña: this.contraseña,
          });
          this.$router.push('/login');
        } catch (error) {
          this.errorMessage = error.response.data.error;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  