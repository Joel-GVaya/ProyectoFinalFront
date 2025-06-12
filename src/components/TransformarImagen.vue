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
      <div 
        class="drop-area" 
        @dragover.prevent 
        @drop.prevent="manejarArrastre"
      >
        <p v-if="!imagen">Arrastra tu imagen aquí</p>
        <img v-if="imagen" :src="imagen" alt="Previsualización" />
      </div>

      <button class="upload-button" @click="subirImagen">Seleccionar Imagen</button>
      <input type="file" ref="fileInput" accept="image/*" @change="manejarArchivo" hidden />

      <button 
        class="convert-button" 
        :disabled="!imagen || cargando" 
        @click="convertirImagen"
      >
        <template v-if="!cargando">
          Convertir Imagen
        </template>
        <template v-else>
          <span class="loader"></span>
          Convirtiendo...
        </template>
      </button>
    </main>
  </div>
</template>

<script>
import { useUserStore } from "@/store/store";
import { mapActions, mapState } from "pinia";
import { useAvisosStore } from '@/store/avisos'

export default {
  name: "TransformarImagen",

  data() {
    return {
      estiloSeleccionado: null,
      imagen: null,
      archivoSeleccionado: null,
      cargando: false // ✅ Estado de carga
    };
  },

  computed: {
    ...mapState(useUserStore, ["estilos"]),
    avisos() {
            return useAvisosStore();  // Esto te dará acceso al store directamente
        }
  },

  methods: {
    ...mapActions(useUserStore, ["transformarImagen"]),

    seleccionarEstilo(id) {
      this.estiloSeleccionado = id;
    },

    manejarArrastre(event) {
      const archivo = event.dataTransfer.files[0];
      if (archivo && archivo.type.startsWith("image/")) {
        this.imagen = URL.createObjectURL(archivo);
        this.archivoSeleccionado = archivo;
      }
    },

    manejarArchivo(event) {
      const archivo = event.target.files[0];
      if (archivo && archivo.type.startsWith("image/")) {
        this.imagen = URL.createObjectURL(archivo);
        this.archivoSeleccionado = archivo;
      }
    },

    subirImagen() {
      this.$refs.fileInput.click();
    },

    async convertirImagen() {
      const avisos = useAvisosStore()
      if (!this.estiloSeleccionado) {
        avisos.mostrarAviso({ mensaje: 'Por favor selecciona un estilo antes de convertir la imagen.', tipo: 'info' })
        return;
      }
      if (!this.archivoSeleccionado) {
        avisos.mostrarAviso({ mensaje: 'Por favor selecciona o arrastra una imagen antes de convertirla.', tipo: 'info' })
        return;
      }

      this.cargando = true; // ✅ Activar spinner

      try {
        const respuesta = await this.transformarImagen(this.archivoSeleccionado, this.estiloSeleccionado);
        if(respuesta){
          this.$router.push({ name: 'MostrarImagen', params: { id: respuesta } });
        }
      } catch (error) {
        console.error("Error al convertir la imagen:", error);
      } finally {
        this.cargando = false; // ✅ Desactivar spinner
      }
    },
  },
};
</script>

<style scoped>
/* Contenedor principal */
.transformar-imagen {
    display: flex;
    height: 85vh;
    background-color: #f3f3f3;
}

/* Barra lateral */
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

/* Área principal */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.drop-area {
    width: 80%;
    height: 300px;
    border: 2px dashed #6a1b9a;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    margin-bottom: 1rem;
    text-align: center;
    color: #6a1b9a;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
}

.drop-area:hover {
    background-color: #f3e5f5;
}

.drop-area img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
}

.upload-button,
.convert-button {
    background-color: #a5d6a7;
    color: #424242;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
}

.upload-button:hover,
.convert-button:hover {
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
