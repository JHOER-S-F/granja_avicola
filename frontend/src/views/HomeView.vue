<template>
  <div>
    
    <p>GRAMJA AVICOLA</p>

    <div>
      <template v-if="isAuthenticated">
        <span>BIENVENIDO {{ user.nombre_usuario }}</span>
        <button @click="logout">CERRAR SESIÓN</button>

        <div v-if="user.rol === 'admin'">
          <h3>un gran  {{ user.rol }}</h3>
          <nav>
            <ul>
              <li><router-link to="/admin/dashboard">Dashboard Admin</router-link></li>
              <li><router-link to="/admin/users">Gestión de Usuarios</router-link></li>
              <li><router-link to="/admin/reports">Reportes</router-link></li>
            </ul>
          </nav>
        </div>

        <div v-else-if="user.rol === 'empleado'">
          <h3>un gran {{ user.rol }} </h3>
          <nav>
            <ul>
              <li><router-link to="/empleado/perfil">Mi Perfil</router-link></li>
              <li><router-link to="/empleado/tareas">Mis Tareas</router-link></li>
              <li><router-link to="/empleado/soporte">Soporte</router-link></li>
            </ul>
          </nav>
        </div>

        <div v-else>
          <p>Cargando usuario...</p>
        </div>
      </template>

      <template v-else>
        <router-link to="/login">INICIAR SESIÓN</router-link>
        <br />
        <router-link to="/register">REGISTRARSE<br />SOLO PERSONAL AUTORIZADO</router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

function logout() {
  authStore.logout()
}
</script>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
}
nav li {
  margin: 5px 0;
}
nav a {
  text-decoration: none;
  color: blue;
}
button {
  margin-top: 10px;
}
</style>
