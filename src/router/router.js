import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/store/store";
import Home from '../components/Home.vue'
import AboutUs from '../components/AboutUs.vue'
import GenerarImagen from '../components/GenerarImagen.vue'
import TransformarImagen from '../components/TransformarImagen.vue'
import IniciarSesion from '../components/IniciarSesion.vue'
import Registro from '../components/Registro.vue'
import Perfil from '../components/Perfil.vue'
import Planes from '../components/Planes.vue'
import Historial from '../components/HistorialImagenesUsuario.vue'
import Publicaciones from '../components/Publicaciones.vue'
import MostrarImagen from '../components/MostrarImagen.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: AboutUs,
  },
  {
    path: '/generar-imagen',
    name: 'GenerarImagen',
    component: GenerarImagen,
    meta: { requiresAuth: true },  // protege esta ruta
  },
  {
    path: '/transformar-imagen',
    name: 'TransformarImagen',
    component: TransformarImagen,
    meta: { requiresAuth: true },  // protege esta ruta
  },
  {
    path: '/iniciar-sesion',
    name: 'IniciarSesion',
    component: IniciarSesion,
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta: { requiresAuth: true },  // protege esta ruta
  },
  {
    path: '/planes',
    name: 'Planes',
    component: Planes,
    meta: { requiresAuth: true },  // protege esta ruta
  },
  {
    path: '/historial',
    name: 'Historial',
    component: Historial,
    meta: { requiresAuth: true },  // protege esta ruta
  },
  {
    path: '/publicaciones',
    name: 'Publicaciones',
    component: Publicaciones,
  },
  {
    path: '/mostrarImagen/:id',
    name: 'MostrarImagen',
    component: MostrarImagen,
    props: true,
    meta: { requiresAuth: true },  // protege esta ruta
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard para rutas protegidas
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.usuario) {
    next('/')
  } else {
    next()
  }
})


export default router
