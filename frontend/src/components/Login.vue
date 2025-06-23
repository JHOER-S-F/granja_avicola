<template>
  <div id="login-container">
    <h2 class="title-highlight">Iniciar Sesión</h2>

    <form @submit.prevent="handleLogin" class="login-form">
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
      <button type="submit" class="btn-primary">INICIAR SESIÓN</button>
    </form>

    <p v-if="errorMessage" class="error-message label-fancy">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import axios from '../axios'

export default {
  data() {
    return {
      nombre_usuario: '',
      contraseña: '',
      errorMessage: '',
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/api/auth/login', {
          nombre_usuario: this.nombre_usuario,
          contraseña: this.contraseña,
        })

        localStorage.setItem('token', response.data.token)

        const { useAuthStore } = await import('../stores/authStore')
        const authStore = useAuthStore()
        authStore.setToken(response.data.token)

        const redirectPath = this.$route.query.redirect || '/'
        this.$router.push(redirectPath)
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error de inicio de sesión'
      }
    },
  },
}
</script>

<style scoped>
#login-container {
  background-color: var(--color-cielo);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 3rem auto;
}

.login-form {
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
