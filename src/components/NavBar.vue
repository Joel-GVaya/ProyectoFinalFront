<template>
  <div class="user-menu" ref="menuRef">
    <template v-if="usuario">
      <img
        :src="usuario.imagen || defaultUserImage"
        alt="perfil"
        class="user-icon"
        @click.stop="toggleMenu"
      />
      <div class="dropdown-menu" v-if="menuAbierto">
        <ul>
          <li class="opcion-usuario">
            <router-link to="/perfil" @click="closeMenu">
              <a><span class="material-icons">account_circle</span> Perfil</a>
            </router-link>
          </li>
          <li class="opcion-usuario">
            <router-link to="/historial" @click="closeMenu">
              <span class="material-icons">schedule</span> Historial
            </router-link>
          </li>
          <li class="opcion-usuario">
            <router-link to="/planes" @click="closeMenu">
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
      <router-link to="/iniciar-sesion" class="auth-button">Log In</router-link>
      <router-link to="/registro" class="auth-button">Register</router-link>
    </template>
  </div>

  <header class="app-header">
    <img src="@/assets/Pixalchemy.png" alt="Logo de la App" class="app-logo" />
  </header>

  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li v-if="usuario"><router-link to="/generar-imagen">Generar Imagen</router-link></li>
      <li v-if="usuario"><router-link to="/transformar-imagen">Transformar Imagen</router-link></li>
      <li><router-link to="/publicaciones">Publicaciones</router-link></li>
      <li><router-link to="/about-us">About Us</router-link></li>
    </ul>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/store/store.js'
import defaultUserImage from '@/assets/defaultUser.png'

export default {
  name: 'AppHeader',

  setup() {
    const menuAbierto = ref(false)
    const menuRef = ref(null)

    const userStore = useUserStore()
    const usuario = userStore.usuario

    const toggleMenu = () => {
      menuAbierto.value = !menuAbierto.value
    }

    const closeMenu = () => {
      menuAbierto.value = false
    }

    const logout = () => {
      userStore.cerrarSesion()
      closeMenu()
      window.location.href = '/' // O usa this.$router.push si tienes acceso
    }

    const handleClickOutside = (event) => {
      if (menuRef.value && !menuRef.value.contains(event.target)) {
        closeMenu()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      usuario,
      menuAbierto,
      toggleMenu,
      closeMenu,
      logout,
      menuRef,
      defaultUserImage
    }
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

.app-header {
  position: relative;
  width: 100%;
  height: 70px;
  background-color: #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 50px;
  z-index: 2;
}

.user-menu {
  position: absolute;
  /* o absolute */
  top: 2rem;
  right: 2rem;
  z-index: 4;
  /* muy alto para que quede delante de todo */
}




.user-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  object-fit: cover;
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
  /* Ancho fijo para alineación */
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
  z-index: 4;
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
}

.dropdown-menu li:hover {
  background-color: #f4f4f4;
}

/* Estilo para los enlaces del menú desplegable */
.dropdown-menu a {
  color: inherit;
  /* Hereda el color del contenedor */
  text-decoration: none;
  /* Elimina el subrayado */
  font-weight: normal;
  /* Opcional: ajusta el peso de la fuente */
}

/* Opcional: Estilo al pasar el ratón por encima */
.dropdown-menu a:hover {
  color: #68af4c;
  /* Cambia el color al pasar el ratón */
  text-decoration: none;
  /* Asegúrate de que no aparezca subrayado */
}

/* Asegúrate de que los iconos y los textos estén alineados verticalmente */
.dropdown-menu li a{
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center; /* Alinea verticalmente el contenido dentro del li */
}

.dropdown-menu li{
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center; /* Alinea verticalmente el contenido dentro del li */
}

.dropdown-menu li a .material-icons {
  margin-right: 5px; /* Añade un espacio entre el icono y el texto */
  font-size: 1.3rem;  /* Puedes ajustar el tamaño del icono si lo necesitas */
}


.navbar {
  background-color: #2c3e50;
  padding: 1rem 0 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.navbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.5rem;
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
</style>
