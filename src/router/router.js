import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import AboutUs from '../components/AboutUs.vue'
import GenerarImagen from '../components/GenerarImagen.vue'
import TransformarImagen from '../components/TransformarImagen.vue'
import IniciarSesion from '../components/IniciarSesion.vue'
import Registro from '../components/Registro.vue'
import Perfil from '../components/Perfil.vue'
import Planes from '../components/Planes.vue'

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
  },
  {
    path: '/transformar-imagen',
    name: 'TransformarImagen',
    component: TransformarImagen,
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
  },
  {
    path: '/planes',
    name: 'Planes',
    component: Planes,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router