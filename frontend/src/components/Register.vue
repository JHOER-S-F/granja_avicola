<template>
  <div id="register-container">
    <h2 class="title-highlight">Regístrate y obtén una experiencia completa</h2>

    <form @submit.prevent="handleRegister" class="register-form">
      <input
        v-model="nombre_usuario"
        type="text"
        placeholder="Nombre de Usuario"
        required
        class="input-field"
      />
      <input
        v-model="contraseña"
        type="password"
        placeholder="Contraseña"
        required
        class="input-field"
      />
      <button type="submit" class="btn-primary">REGISTRAR</button>
    </form>

    <p v-if="errorMessage" class="error-message label-fancy">
      {{ errorMessage }}
    </p>
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
        await axios.post('/api/auth/register', {
          nombre_usuario: this.nombre_usuario,
          contraseña: this.contraseña,
        });
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al registrar';
      }
    },
  },
};
</script>

<style scoped>
#register-container {
  background-color: var(--color-cielo);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 3rem auto;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.input-field:focus {
  border-color: var(--color-esmeralda);
}

.error-message {
  margin-top: 1rem;
  color: #fff;
  background-color: var(--color-coral);
  text-align: center;
}
</style>
