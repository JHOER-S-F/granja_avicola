<template>
    <div>
      <h2>Logout</h2>
      <button @click="handleLogout">Cerrar sesión</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleLogout() {
        // Eliminar el token del almacenamiento local
        localStorage.removeItem('token');
        // Redirigir al login
        this.$router.push('/');
      },
    },
  };
  </script>
  