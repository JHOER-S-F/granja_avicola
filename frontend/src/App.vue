<script setup>
import { onMounted, ref } from 'vue'
import axios from './axios'
//import NavBar from './components/NavBar.vue'

const message = ref('')

const fetchMessage = async () => {
  try {
    const response = await axios.get('/api/hola')
    message.value = response.data.mensaje
  } catch (error) {
    console.error('Error al obtener el mensaje:', error)
  }
}

onMounted(fetchMessage)
</script>

<template>
  <div>
  
    <RouterView />
    <div>
      <h2>{{ message }}</h2>
    </div>
  </div>
</template>

