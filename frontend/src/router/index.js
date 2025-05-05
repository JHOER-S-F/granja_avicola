import { createRouter, createWebHistory } from 'vue-router'

// Importa tus vistas
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Logout from '../components/Logout.vue';
import HomeView from '../views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/logout', component: Logout },

  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Verifica la autenticación y los roles antes de entrar a una ruta protegida
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Asume que el rol está almacenado en el token o localStorage
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next('/login');
      } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        next('/'); // Redirigir si el rol no está permitido
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router
