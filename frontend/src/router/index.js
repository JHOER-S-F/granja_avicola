import { createRouter, createWebHistory } from 'vue-router'

// VISTAS PRINSIPALES
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Logout from '../components/Logout.vue';

//VISTA ADMIN
import ali from '../views/admin/AlimentacionPollos.vue'
import met from '../views/admin/MetodosPago.vue'
import inv from '../views/admin/InventarioComponent.vue'
import usu from '../views/admin/Usuarios.vue'
import baj from '../views/admin/BajasPollos.vue'
import inc from '../views/admin/IncubadorasComponent.vue'
import lot from '../views/admin/LotesHuevosComponent.vue'
import pol from '../views/admin/pollitosComponent.vue'
import vac from '../views/admin/VacunasComponent.vue'
import pro from '../views/admin/PollosProduccionComponent.vue'
import ven from '../views/admin/VentasPollitosComponent.vue'
import vep from '../views/admin/VentasPollosComponent.vue'
import tra from '../views/admin/TrabajadoresComponent.vue'
import pag from '../views/admin/PagosTrabajadoresComponent.vue'
import gas from '../views/admin/GastosGeneralesComponent.vue'
import com from '../views/admin/InversionComprasComponent.vue'
import con from '../views/admin/ContabilidadGeneralComponent.vue'
import eve from '../views/admin/EventosGeneralesComponent.vue'
//VISTA EMPLEADO
import alimentacion from '../views/empleado/AlimentacionPollos.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/logout', component: Logout },
  //VISTA ADMIN
  { path: '/admin/ali', component:ali},
  { path: '/admin/met', component:met},
  { path: '/admin/inv', component:inv},
  { path: '/admin/usu', component:usu},
  { path: '/admin/baj', component:baj},
  { path: '/admin/inc', component:inc},
  { path: '/admin/lot', component:lot},
  { path: '/admin/pol', component:pol},
  { path: '/admin/vac', component:vac},
  { path: '/admin/pro', component:pro},
  { path: '/admin/ven', component:ven},
  { path: '/admin/vep', component:vep},
  { path: '/admin/tra', component:tra},
  { path: '/admin/pag', component:pag},
  { path: '/admin/gas', component:gas},
  { path: '/admin/com', component:com},
  { path: '/admin/con', component:con},
  { path: '/admin/eve', component:eve},
  //VISTA EMPLEADO
  { path: '/empleado/alimentacion', component: alimentacion},

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
