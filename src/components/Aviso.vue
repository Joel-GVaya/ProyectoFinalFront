<template>
  <div class="avisos-container">
    <div
      v-for="aviso in avisos"
      :key="aviso.id"
      class="aviso"
      :class="aviso.tipo"
    >
      <span>{{ aviso.mensaje }}</span>
      <button @click="eliminarAviso(aviso.id)">✖</button>
    </div>
  </div>
</template>

<script setup>
import { useAvisosStore } from '@/store/avisos.js'
import { storeToRefs } from 'pinia'

const avisosStore = useAvisosStore()
const { avisos } = storeToRefs(avisosStore)
const { eliminarAviso } = avisosStore
</script>

<style scoped>
.avisos-container {
  position: absolute;
  top: 8rem; /* Cambié esto para moverlo más abajo */
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
}

.aviso {
  background-color: #323232;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  transition: opacity 0.3s ease;
}

.aviso.success {
  background-color: #4caf50;
}

.aviso.error {
  background-color: #f44336;
}

.aviso.info {
  background-color: #2196f3;
}

.aviso button {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1rem;
}
</style>
