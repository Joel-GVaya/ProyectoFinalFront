<template>
  <div class="mostrar-imagen">
    <h2>Imagen Generada</h2>
    <p>ID de la imagen: <strong>{{ id }}</strong></p>
  </div>
</template>

<script>
export default {
  name: "MostrarImagen",

  // Si lo usas como componente hijo y pasas el id como prop
  props: {
    id: {
      type: String,
      required: true
    }
  },

  // Alternativamente, si lo usas como página (y el id viene por ruta)
  // puedes usar:
  /*
  computed: {
    id() {
      return this.$route.params.id;
    }
  }
  */
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
</style>
