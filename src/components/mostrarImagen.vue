<template>
  <div class="mostrar-imagen">
    <h2>Imagen Generada</h2>
    <!-- Mostrar la imagen si ya está cargada -->
    <div v-if="imagen">
      <img :src="`data:image/png;base64,${imagen}`" alt="Imagen generada" class="imagen" />
    </div>
    <div v-else>
      <p>Cargando imagen...</p>
    </div>

    <!-- Botones -->
    <div class="botones">
      <button @click="descargar">Descargar</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/store";

export default {
  name: "MostrarImagen",

  props: {
    id: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      imagen: null,
      userStore: null
    };
  },

  async mounted() {
    try {
      const userStore = useUserStore();
      await new Promise(resolve => setTimeout(resolve, 500));
      const respuesta = await userStore.getImagenGeneradaByID(this.id);

      console.log("Respuesta de getImagenGeneradaByID:", respuesta);

      if (respuesta.ImagenBase64) {
        this.imagen = respuesta.ImagenBase64;
      } else {
        console.warn("No se encontró ninguna imagen válida para el ID proporcionado.");
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
    }
  },


  methods: {
    descargar() {
      if (!this.imagen) {
        console.error("No hay imagen para descargar.");
        return;
      }
      const enlace = document.createElement("a");
      enlace.href = `data:image/png;base64,${this.imagen}`;
      enlace.download = `imagen.png`;

      // Añadir a DOM y clickear para iniciar descarga
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    }

  }
};
</script>


<style scoped>
.mostrar-imagen {
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
  color: #333;
}

h2 {
  color: #6a1b9a;
  margin-bottom: 1rem;
}

.imagen {
  max-width: 600px;
  /* tamaño fijo máximo */
  width: 100%;
  /* que ocupe todo el contenedor hasta ese max */
  height: auto;
  margin: 1rem 0;
  border: 3px solid #000000;
  border-radius: 8px;
}


.botones {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #6a1b9a;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #4a148c;
}
</style>
