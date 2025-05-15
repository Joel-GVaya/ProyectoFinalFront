// store/avisos.js
import { defineStore } from 'pinia'

let nextId = 1

export const useAvisosStore = defineStore('avisos', {
  state: () => ({
    avisos: []
  }),

  actions: {
    mostrarAviso({ mensaje, tipo = 'info' }) {
      const id = nextId++
      this.avisos.push({ id, mensaje, tipo })

      // Auto eliminar a los 10 segundos
      setTimeout(() => {
        this.avisos = this.avisos.filter(aviso => aviso.id !== id)
      }, 10000)
    },

    eliminarAviso(id) {
      this.avisos = this.avisos.filter(aviso => aviso.id !== id)
    }
  }
})
