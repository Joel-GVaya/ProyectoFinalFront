<template>
  <div class="generar-imagen">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <h2>Estilos</h2>
      <ul>
        <li v-for="estilo in estilos" :key="estilo.id" :class="{ selected: estiloSeleccionado === estilo.id }"
          @click="seleccionarEstilo(estilo.id)">
          <img :src="estilo.imagen" alt="Estilo" class="style-image" />
          <p>{{ estilo.nombre }}</p>
        </li>
      </ul>
    </aside>

    <div class="middle-text">
      ¡Introduce la descripcion de la imagen que quieres generar y selecciona un estilo!
    </div>

    <!-- Área principal -->
    <main class="main-content">
      <div class="text-input-area">
        <label for="descripcion">Descripción para generar imagen:</label>
        <textarea id="descripcion" v-model="descripcionTexto"
          placeholder="Escribe aquí lo que quieres generar..."></textarea>
        <button class="convert-button" :disabled="!descripcionTexto.trim() || !estiloSeleccionado || cargando
          " @click="generarImagenDesdeTexto">
          <template v-if="!cargando"> Generar Imagen </template>
          <template v-else>
            <span class="loader"></span>
            Generando...
          </template>
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
      descripcionTexto: "",
      cargando: false,
    };
  },

  computed: {
    ...mapState(useUserStore, ["estilos"]),
  },

  methods: {
    ...mapActions(useUserStore, ["generarImagen"]),

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

      this.cargando = true;
      try {
        // Llama a la acción que genera la imagen y recibe la respuesta
        const respuesta = await this.generarImagen(
          this.descripcionTexto,
          this.estiloSeleccionado
        );
        // Redirige a MostrarImagen pasando el id o nombreArchivo retornado
        if(respuesta){
          this.$router.push({
          name: "MostrarImagen",
          params: { id: respuesta.IdImagenGenerada },
          });
        }
        
      } catch (error) {
        console.error("Error al generar la imagen:", error);
        alert(`Error: ${error.message || error}`);
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>

<style scoped>
/* (mismos estilos que ya tenías, agregué un loader para el botón) */

.generar-imagen {
  display: flex;
  align-items: center;
  height: 85vh;
  background-color: #284870;
}

/* Barra lateral */
.sidebar {
  margin-left: 40px;
  width: 20%;
  background-color: #5d497c;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: 4px solid #8433ae;
  border-radius: 12px;
  max-height: 80vh;
  overflow-y: auto;
}

.sidebar h2 {
  color: white;
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
  background-color: #9bf138d2;
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

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  background-color: #284870;
}

.text-input-area {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #335f96;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.text-input-area label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.convert-button:hover:not(:disabled) {
  background-color: #81c784;
  transform: scale(1.05);
}

.convert-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ccc;
  border-top: 3px solid #6a1b9a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.middle-text {
  color: white;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Poppins', 'Quicksand', 'Nunito', sans-serif;
  max-width: 18%;
  /* tipografías redondeadas comunes */
  text-align: center;
  align-self: center;
  /* para centrar verticalmente en flex container */
  margin: 0 20px;

  /* Sombra verdosa en las letras */
  text-shadow:
    2px 2px 4px #4f8868,   /* sombra abajo derecha */
    -2px 2px 4px #4f8868,  /* sombra abajo izquierda */
    2px 0 3px #4f8868,     /* sombra derecha */
    -2px 0 3px #4f8868;    /* sombra izquierda */

  user-select: none;
  /* opcional para que no se seleccione */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
