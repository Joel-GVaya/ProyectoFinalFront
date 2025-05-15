<template>
  <div class="transformar-imagen">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <h2>Estilos</h2>
      <ul>
        <li 
          v-for="estilo in estilos" 
          :key="estilo.id" 
          :class="{ selected: estiloSeleccionado === estilo.id }"
          @click="seleccionarEstilo(estilo.id)"
        >
          <img :src="estilo.imagen" alt="Estilo" class="style-image" />
          <p>{{ estilo.nombre }}</p>
        </li>
      </ul>
    </aside>

    <!-- Área principal -->
    <main class="main-content">
      <div class="text-input-area">
        <label for="descripcion">Descripción para generar imagen:</label>
        <textarea 
          id="descripcion" 
          v-model="descripcionTexto" 
          placeholder="Escribe aquí lo que quieres generar..."
        ></textarea>
        <button class="convert-button" :disabled="!descripcionTexto" @click="generarImagenDesdeTexto">
          Generar Imagen
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { useUserStore } from "@/store/store";
import { mapActions, mapState } from "pinia";

export default {
  name: "TransformarImagen",

  data() {
    return {
      estiloSeleccionado: null,
      descripcionTexto: ""
    };
  },

  computed: {
    ...mapState(useUserStore, ["estilos"])
  },

  methods: {
    ...mapActions(useUserStore, ["generarLineArt"]),

    seleccionarEstilo(id) {
      this.estiloSeleccionado = id;
    },

    async generarImagenDesdeTexto() {
      if (!this.estiloSeleccionado) {
        alert("Por favor selecciona un estilo antes de generar la imagen.");
        return;
      }
      if (!this.descripcionTexto.trim()) {
        alert("Por favor ingresa una descripción.");
        return;
      }

      try {
        // Aquí puedes cambiar a una acción como generarDesdeTexto si la tienes
        const respuesta = await this.generarLineArt(this.descripcionTexto); 
        alert(`Imagen generada exitosamente con descripción: "${this.descripcionTexto}"`);
      } catch (error) {
        console.error("Error al generar la imagen:", error);
        alert(`Error: ${error.message}`);
      }
    }
  }
};
</script>

<style scoped>
.transformar-imagen {
    display: flex;
    height: 85vh;
    background-color: #f3f3f3;
}

/* Sidebar */
.sidebar {
    margin: 5px;
    width: 20%;
    background-color: #d1c4e9;
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    border: 4px solid #6a1b9a;
    border-radius: 12px;
}

.sidebar h2 {
    color: #6a1b9a;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    text-align: center;
}

.sidebar ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar li {
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sidebar li:hover {
    background-color: #a5d6a7;
}

.sidebar li.selected {
    background-color: #22b1bba1;
    color: white;
}

.style-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.sidebar p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: bold;
    color: #424242;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* Empuja hacia abajo */
    padding: 2rem;
}

/* Text Input Area */
.text-input-area {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.text-input-area label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #6a1b9a;
    font-size: 1.1rem;
}

.text-input-area textarea {
    width: 100%;
    height: 150px;
    padding: 0.75rem;
    border: 2px solid #6a1b9a;
    border-radius: 8px;
    resize: vertical;
    font-size: 1rem;
    margin-bottom: 1rem;
}

.convert-button {
    background-color: #a5d6a7;
    color: #424242;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.convert-button:hover {
    background-color: #81c784;
    transform: scale(1.05);
}

.convert-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
