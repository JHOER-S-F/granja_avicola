<template>
  <div id="granja-home">
    <h1 class="brand">🐓 Bienvenido a Granja El Progreso</h1>

    <p v-if="isAuthenticated" class="saludo">
      ¡Hola <span class="destacado">{{ user.name }}</span>! Qué bueno verte de nuevo 🌾
    </p>
    <p v-else class="saludo">
      ¡Hola visitante! Disfruta de un recorrido virtual por nuestro gallinero digital 🐣
    </p>

    <div class="huevo-container" @click="sorprender">
      <div class="huevo" :class="{ abierto: sorpresaActiva }">
        <span v-if="sorpresaActiva" class="emoji-sorpresa">🎁</span>
      </div>
      <p class="click-text">Haz clic en el huevo para una sorpresa</p>
    </div>

    <div class="clima-simulacion">
      <p class="clima-msg">☀️ Clima actual: Soleado con 20% de posibilidad de huevos frescos</p>
    </div>

    <div class="gallina-animada">
      <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Gallina" />
      <p class="gallina-texto">🐤</p>
    </div>

    <div class="espacio-final">
      <p>Gracias por visitar nuestro hogar de campo 🌿</p>
      <button v-if="isAuthenticated" @click="logout" class="salir-btn">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user || { name: 'Invitado' })

const sorpresaActiva = ref(false)

function sorprender() {
  sorpresaActiva.value = !sorpresaActiva.value
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
#granja-home {
  max-width: 800px;
  margin: auto;
  padding: 3rem 2rem;
  background: linear-gradient(145deg, #f0f8ff, #e8f5e9);
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease;
}

.brand {
  font-size: 2.5rem;
  color: #388e3c;
  margin-bottom: 1rem;
}

.saludo {
  font-size: 1.3rem;
  color: #444;
  margin-bottom: 2rem;
}

.destacado {
  color: #ff9800;
  font-weight: bold;
}

.huevo-container {
  margin: 2rem auto;
  cursor: pointer;
}

.huevo {
  width: 100px;
  height: 130px;
  background: radial-gradient(ellipse at center, #fff 60%, #fbe9e7 100%);
  border-radius: 50% 50% 45% 45% / 55% 55% 40% 40%;
  margin: auto;
  position: relative;
  transition: transform 0.4s;
}

.huevo.abierto {
  transform: scale(1.2) rotate(10deg);
  background: #ffe0b2;
}

.emoji-sorpresa {
  position: absolute;
  font-size: 2rem;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1s infinite;
}

.click-text {
  font-size: 0.95rem;
  color: #888;
  margin-top: 0.5rem;
}

.clima-simulacion {
  background-color: #fffde7;
  padding: 1rem;
  margin: 2rem auto;
  border-radius: 12px;
  color: #5d4037;
  font-style: italic;
}

.gallina-animada {
  margin-top: 2rem;
  animation: picotear 3s infinite;
}

.gallina-animada img {
  width: 80px;
}

.gallina-texto {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

.espacio-final {
  margin-top: 2rem;
  font-size: 1rem;
  color: #777;
}

.salir-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: #ef5350;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.salir-btn:hover {
  background-color: #d32f2f;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes picotear {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}
</style>
