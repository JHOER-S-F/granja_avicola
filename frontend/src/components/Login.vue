<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="nombre_usuario" type="text" placeholder="Nombre de Usuario" required />
      <input v-model="contraseña" type="password" placeholder="Contraseña" required />
      <button type="submit">INICIAR SESIÓN</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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

        // Guardar token en localStorage
        localStorage.setItem('token', response.data.token)

        // Actualizar el store con el nuevo token
        const { useAuthStore } = await import('../stores/authStore')
        const authStore = useAuthStore()
        authStore.setToken(response.data.token)

        // Redirigir
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
.error {
  color: red;
}
</style>
