<template>
  <header class="app-header">
    <img src="@/assets/Pixalchemy.png" alt="Logo de la App" class="app-logo" />
    <div class="user-menu">
      <template v-if="usuario">
        <img :src="usuario.imagen || defaultUserImage" alt="perfil" class="user-icon" @click="toggleMenu" />
        <div class="dropdown-menu" v-if="menuAbierto">
          <ul>
            <li class="opcion-usuario">
              <router-link to="/perfil" @click="closeMenu">
                <span class="material-icons" style="vertical-align: middle; margin-right: 6px;">account_circle</span>
                Perfil
              </router-link>
            </li>
            <li class="opcion-usuario">
              <router-link to="/historial" @click="closeMenu">
                <span class="material-icons" style="vertical-align: middle; margin-right: 6px;">schedule</span>
                Historial
              </router-link>
            </li>
            <li class="opcion-usuario">
              <router-link to="/planes" @click="closeMenu">
                <span class="material-icons" style="vertical-align: middle; margin-right: 6px;">bolt</span>
                Planes
              </router-link>
            </li>
            <li @click="logout" class="opcion-usuario cerrar-sesion">
              <span class="material-icons" style="vertical-align: middle; margin-right: 6px;">logout</span>
              Log Out
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <router-link to="/iniciar-sesion" class="auth-button">Log In</router-link>
        <router-link to="/registro" class="auth-button">Register</router-link>
      </template>
    </div>
  </header>

  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li v-if="usuario"><router-link to="/generar-imagen">Generar Imagen</router-link></li>
      <li v-if="usuario"><router-link to="/transformar-imagen">Transformar Imagen</router-link></li>
      <li><router-link to="/about-us">About Us</router-link></li>
    </ul>
  </nav>
</template>

<script>
import { useUserStore } from "@/store/store.js";
import { mapState, mapActions } from "pinia";
import defaultUserImage from "@/assets/defaultUser.png";

export default {
  name: "AppHeader",

  data() {
    return {
      menuAbierto: false,
      defaultUserImage,
    };
  },

  computed: {
    ...mapState(useUserStore, ["usuario"]),
  },

  methods: {
    ...mapActions(useUserStore, ['cerrarSesion']), // Mapear la acción 'cerrarSesion'

    toggleMenu() {
      this.menuAbierto = !this.menuAbierto;
    },

    closeMenu() {
      this.menuAbierto = false;
    },

    // Método para cerrar sesión, utilizando la acción 'cerrarSesion'
    logout() {
      this.cerrarSesion(); // Llamar la acción directamente
      this.$router.push("/"); // Redirige a la página principal
      this.closeMenu(); // Cierra el menú
    },
  },
};
</script>

<style scoped>
/* General styles */
html, body {
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
    height: 50px;
    z-index: 2;
}

.user-menu {
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
}

.user-icon {
    width: 40px;
    height: 40px;
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
    width: 120px; /* Ancho fijo para alineación */
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
    z-index: 1001;
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
    color: inherit; /* Hereda el color del contenedor */
    text-decoration: none; /* Elimina el subrayado */
    font-weight: normal; /* Opcional: ajusta el peso de la fuente */
}

/* Opcional: Estilo al pasar el ratón por encima */
.dropdown-menu a:hover {
    color: #68af4c; /* Cambia el color al pasar el ratón */
    text-decoration: none; /* Asegúrate de que no aparezca subrayado */
}

.navbar {
    background-color: #2c3e50;
    padding: 0.5rem 0 0.5rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 999;
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
