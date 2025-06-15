<script setup>
import NavBar from './components/NavBar.vue'
import Aviso from './components/Aviso.vue' // Asegúrate de esta ruta
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/store.js'

const userStore = useUserStore()
const avisosRef = ref(null)

onMounted(() => {
  userStore.populateEstilos()
})

// Función global para mostrar avisos
function mostrarAviso(mensaje) {
  avisosRef.value?.agregarAviso(mensaje)
}
</script>

<template>
  <div id="app">
    <NavBar />
    <Aviso />
    <main class="app-content">
      <router-view @avisar="mostrarAviso" />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* El contenido se separa del header y navbar fijo */
.app-content {
  padding-top: 200px; /* Ajusta este valor al total de la altura fija */
}
</style>
