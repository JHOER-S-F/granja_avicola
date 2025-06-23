<template>
  <div id="app-container">
    <header class="app-header">
      <h1 class="logo"><RouterLink to="/" class="nav-link">🐣 Granja Avícola El Progreso</RouterLink></h1>

      <!-- NAV VISITANTE -->
      <nav class="main-nav" v-if="!isAuthenticated">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
        <RouterLink to="/register" class="nav-link">Registro</RouterLink>
        <RouterLink to="/contacto" class="nav-link">Contacto</RouterLink>
      </nav>

      <!-- NAV USUARIO AUTENTICADO -->
      <section v-else class="verifiv">
        <span class="welcome-msg">BIENVENIDO <strong>{{ user.nombre_usuario }}</strong></span>

        <!-- ADMIN -->
        <div v-if="user.rol === 'admin'" class="role-panel admin-panel">
          <h3><span class="role-highlight">{{ user.rol }}</span></h3>
          <nav class="main-nav">
            
            <RouterLink to="/admin/usu" class="nav-link">Usuarios</RouterLink>
            <RouterLink to="/admin/eve" class="nav-link">Reportes</RouterLink>
            <RouterLink to="/admin/ali" class="nav-link">alimentacion</RouterLink>
            <RouterLink to="/admin/met" class="nav-link">metodos_p</RouterLink>
            <RouterLink to="/admin/inv" class="nav-link">inventario</RouterLink>
            <RouterLink to="/admin/baj" class="nav-link">basjas</RouterLink>
            <RouterLink to="/admin/inc" class="nav-link">incubadora</RouterLink>
            <RouterLink to="/admin/lot" class="nav-link">lotes_H</RouterLink>
            <RouterLink to="/admin/pol" class="nav-link">pollitos</RouterLink>
            <RouterLink to="/admin/vac" class="nav-link">vacunas</RouterLink>
            <RouterLink to="/admin/pro" class="nav-link">Pollos_P</RouterLink>
            <RouterLink to="/admin/ven" class="nav-link">ventas_P</RouterLink>
            <RouterLink to="/admin/vep" class="nav-link">ventas_Pp</RouterLink>
            <RouterLink to="/admin/tra" class="nav-link">trabajadores</RouterLink>
            <RouterLink to="/admin/pag" class="nav-link">PagoTra</RouterLink>
            <RouterLink to="/admin/gas" class="nav-link">Gastos</RouterLink>
            <RouterLink to="/admin/com" class="nav-link">compras</RouterLink>
            <RouterLink to="/admin/con" class="nav-link">Contabilidad</RouterLink>
          </nav>
        </div>

        <!-- EMPLEADO -->
        <div v-else-if="user.rol === 'empleado'" class="role-panel empleado-panel">
          <h3>Eres un gran <span class="role-highlight">{{ user.rol }}</span></h3>
          <nav class="main-nav">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            <RouterLink to="/empleado/perfil" class="nav-link">Mi Perfil</RouterLink>
            <RouterLink to="/empleado/tareas" class="nav-link">Mis Tareas</RouterLink>
            <RouterLink to="/empleado/soporte" class="nav-link">Soporte</RouterLink>
            <RouterLink to="/empleado/Alimentacion" class="nav-link">ALIMENTACION</RouterLink>
            <RouterLink to="/empleado/" class="nav-link">ALIMENTACION</RouterLink>
          </nav>
        </div>

        <button @click="logout" class="btn-secondary">CERRAR SESIÓN</button>
      </section>
    </header>

    <!-- CONTENIDO CON TRANSICIÓN -->
    <transition name="fade" mode="out-in">
      <main class="main-content">
        <RouterView />
      </main>
    </transition>

<footer class="app-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h2>🐔 Granja Avícola El Progreso</h2>
        <p>Conectando el campo con la tecnología, un huevo a la vez 🥚
          
        </p>
      </div>

      <div class="footer-description">
        <p>
          Nuestra misión es brindar productos avícolas de calidad, con amor por la naturaleza, el respeto por los animales
          y la innovación constante. Desde nuestras gallinas felices hasta tu mesa, todo lo hacemos con pasión. ❤️🌱
        </p>
        <p>
          ¡Gracias por ser parte de esta revolución rural donde lo tradicional y lo digital se abrazan! 🌍🐣
        </p>
      </div>

      <div class="footer-motto">
        <blockquote>“En cada huevo, una historia. En cada historia, progreso.”</blockquote>
      </div>

      <div class="footer-credits">
        <p>
          Desarrollado con 🧡 y muchas tazas de café ☕ en la sombra de un árbol.  
        </p>
        <p>&copy; 2025 Granja El Progreso — Todos los derechos reservados</p>
      </div>

      <div class="footer-eggs">
        <span class="emoji">🥚</span>
        <span class="emoji">🐣</span>
        <span class="emoji">🐔</span>
        <span class="emoji">🌽</span>
        <span class="emoji">🌞</span>
      </div>
    </div>
  </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/authStore'
import { RouterView, RouterLink } from 'vue-router'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

function logout() {
  authStore.logout()
}
</script>

<style scoped>
:root {
  --color-cielo: #e0f7fa;
  --color-pollo: #ffcc80;
  --color-coral: #ff7043;
  --color-esmeralda: #4db6ac;
  --color-footer: #00695c;
  --radius-lg: 16px;
  --radius-sm: 8px;
  --transition-fast: 0.3s ease;
}

#app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fafafa;
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, var(--color-esmeralda), #00796b);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 5px solid var(--color-pollo);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.logo {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.nav-link:hover {
  background-color: var(--color-pollo);
  color: #000;
  transform: scale(1.05);
}

.welcome-msg {
  margin: 1rem 0 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
}

.role-panel {
  margin-top: 0.5rem;
  animation: fadeInUp 0.5s ease;
}

.role-highlight {
  background-color: var(--color-pollo);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  color: #000;
}

.btn-secondary {
  background-color: var(--color-coral);
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: var(--transition-fast);
}

.btn-secondary:hover {
  background-color: #ff5722;
  transform: scale(1.05);
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(to bottom, #ffffff, var(--color-cielo));
  animation: fadeIn 0.8s ease;
  border-top: 3px solid var(--color-pollo);
}

.app-footer {
  background-color: var(--color-footer);
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
}

/* ANIMACIONES */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }

  .btn-secondary {
    width: 100%;
  }

  .logo {
    font-size: 1.5rem;
  }

  .main-content {
    padding: 1rem;
  }
}

.app-footer {
  background: linear-gradient(to top, #f1f8e9, #e0f2f1);
  padding: 3rem 1.5rem;
  color: #4e342e;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  border-top: 4px solid #aed581;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 900px;
  margin: auto;
}

.footer-brand h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #558b2f;
}

.footer-brand p {
  font-style: italic;
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #6d4c41;
}

.footer-description p {
  margin: 1rem 0;
  line-height: 1.6;
  color: #5d4037;
  font-size: 1.05rem;
}

.footer-motto blockquote {
  margin: 2rem auto;
  font-size: 1.3rem;
  color: #8d6e63;
  font-weight: bold;
  font-style: italic;
}

.footer-credits p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #795548;
}

.footer-eggs {
  margin-top: 2rem;
  font-size: 1.8rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  animation: saltar 2.5s infinite ease-in-out;
}

.emoji {
  transition: transform 0.3s ease;
}
.emoji:hover {
  transform: scale(1.3) rotate(-5deg);
}

/* Animaciones */
@keyframes saltar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

</style>
