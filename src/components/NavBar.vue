<template>
  <div class="app-header-wrapper">
    <div class="user-menu" ref="menuRef">
      <template v-if="usuario">
        <div class="app-logo">
        <img
          :src="usuario.Imagen || defaultUserImage"
          alt="perfil"
          class="user-icon"
          @click.stop="toggleMenu"
        />
        </div>
        <div class="dropdown-menu" v-if="menuAbierto">
          <ul>
            <li class="opcion-usuario">
              <router-link to="/perfil" @click.native="closeMenu">
                <a><span class="material-icons">account_circle</span> Perfil</a>
              </router-link>
            </li>
            <li class="opcion-usuario">
              <router-link to="/historial" @click.native="closeMenu">
                <span class="material-icons">schedule</span> Historial
              </router-link>
            </li>
            <li class="opcion-usuario">
              <router-link to="/planes" @click.native="closeMenu">
                <span class="material-icons">bolt</span> Planes
              </router-link>
            </li>
            <li @click="logout" class="opcion-usuario cerrar-sesion">
              <span class="material-icons">logout</span> Log Out
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <div class="auth-buttons">
        <router-link to="/iniciar-sesion" class="auth-button">Log In</router-link>
        <router-link to="/registro" class="auth-button">Register</router-link>
        </div>
      </template>
    </div>

    <header class="app-header">
  <img src="@/assets/logo3.png" alt="Logo de la App" class="main-logo" />
</header>


    <nav class="navbar">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li v-if="usuario"><router-link to="/generar-imagen">Generar Imagen</router-link></li>
        <li v-if="usuario"><router-link to="/transformar-imagen">Transformar Imagen</router-link></li>
        <li><router-link to="/publicaciones">Arte Generado</router-link></li>
        <li><router-link to="/about-us">About Us</router-link></li>
      </ul>
    </nav>
  </div>
</template>


<script>
import { useUserStore } from '@/store/store.js'
import defaultUserImage from '@/assets/defaultUser.png'

export default {
  name: 'AppHeader',

  data() {
    return {
      menuAbierto: false,
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    usuario() {
      return this.userStore.usuario
    },
    defaultUserImage() {
      return defaultUserImage
    }
  },

  methods: {
    toggleMenu() {
      this.menuAbierto = !this.menuAbierto
    },
    closeMenu() {
      this.menuAbierto = false
    },
    logout() {
      this.userStore.cerrarSesion()
      this.closeMenu()
      this.$router.push('/')
    },
    handleClickOutside(event) {
      if (this.$refs.menuRef && !this.$refs.menuRef.contains(event.target)) {
        this.closeMenu()
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
/* General styles */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

/* HEADER FIJO */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color:#00193a;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 400px;
  z-index: 1001;
}

/* Nuevo selector para el logo central */
.main-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 400px; /* o el tamaño que desees */
  z-index: 1001;
  pointer-events: none; /* esto solo afecta al logo visual, no al user-icon */
}


/* USER MENU FIJO */
.user-menu {
  position: fixed;
  top: 1rem;
  right: 2rem;
  z-index: 1100;
}

.user-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  object-fit: cover;
  margin-top: 215px;
  margin-right: 45px;
}

.auth-button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  padding: 3px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 12px;
  font-style: bold;
  text-align: center;
  transition: background-color 0.3s ease;
  width: 120px;
}

.auth-button:hover {
  background-color: #4caf50;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1101;
  width: 150px;
  display: block;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
}

.dropdown-menu li:hover {
  background-color: #f4f4f4;
}

.dropdown-menu a {
  color: inherit;
  text-decoration: none;
  font-weight: normal;
  display: flex;
  align-items: center;
}

.dropdown-menu a:hover {
  color: #68af4c;
  text-decoration: none;
}


.dropdown-menu li a .material-icons {
  margin-right: 5px;
  font-size: 1.3rem;
}

.navbar {
  position: fixed;
  top: 120px; /* justo debajo del header */
  left: 0;
  width: 100%;
  background-color: #00224e;
  padding: 1rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  justify-content: center;
}

.navbar ul {
  list-style: none;
  margin-right: 500px;
  margin-left: 500px;
  padding: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 15px;
  z-index: 1002;
}

.navbar li {
  display: inline;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  border-radius: 8px;
  line-height: 1.5;
}

.navbar a:hover {
  background-color: #4caf50;
  transform: scale(1.1);
  color: white;
}

.opcion-usuario {
  cursor: pointer;
  border-radius: 15px;
}

.cerrar-sesion:hover {
  color: #e74c3c;
}

.auth-buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.home{
  background-color: #284870;
}


/* IMPORTANTE: evita que el contenido quede tapado por header + navbar */
/* Ajusta el padding según la altura combinada de header + navbar */
main, .page-content, .contenido {
  padding-top: 130px; /* 70px header + 60px navbar aprox */
}
</style>



