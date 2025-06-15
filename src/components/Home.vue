<template>
  <div class="home">
    <header v-if="!usuario" class="hero">
      <h1>Descubre el Poder de Dibujos Colorear</h1>
      <p>Convierte tus imágenes en obras de arte únicas o genera imágenes increíbles a partir de texto.</p>
      <router-link to="/registro" class="cta-button">¡Regístrate y Prueba Ahora!</router-link>
    </header>

    <section class="examples">
      <h2>Explora Nuestros Estilos</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="estilo in estilos" :key="estilo.id">
          <img :src="estilo.imagen" :alt="estilo.nombre" class="example-image" />
          <p>{{ estilo.nombre }}</p>
        </div>
      </div>
    </section>

    <section class="features">
      <h2>¿Por qué elegirnos?</h2>
      <ul class="features-list">
        <li>🎨 Transforma tus fotos en arte en segundos</li>
        <li>🧠 IA avanzada entrenada en estilos populares</li>
        <li>🖼️ Generación de imágenes desde texto o imagen</li>
        <li>👶 Apto para niños y fácil de usar</li>
      </ul>
    </section>

    <section class="text-to-image">
      <h2>Genera Imágenes a Partir de Texto</h2>
      <p>Escribe una descripción y observa cómo nuestra IA la convierte en una imagen impresionante.</p>
      <router-link to="/generar-imagen" class="cta-button">Prueba la Generación de Texto a Imagen</router-link>
    </section>

    <section class="image-to-image">
      <h2>Transforma tus propias imágenes</h2>
      <p>Puedes proporcionarnos una imagen propia, seleccionar el estilo que te guste y convertirla.</p>
      <router-link to="/transformar-imagen" class="cta-button">Prueba la Generación de Imagen a Imagen</router-link>
    </section>

    <section class="testimonios">
      <h2>Lo que dicen nuestros usuarios</h2>
      <div class="testimonial-card">
        <p>"¡Mis hijos aman colorear los dibujos generados! Es fácil, divertido y educativo."</p>
        <strong>- Laura, madre de 2 niños</strong>
      </div>
      <div class="testimonial-card">
        <p>"Como diseñador, me ahorra mucho tiempo para hacer pruebas rápidas de estilos visuales."</p>
        <strong>- Marcos, diseñador gráfico</strong>
      </div>
    </section>

    <footer class="final-cta">
      <h2>¿Listo para crear algo increíble?</h2>
      <router-link to="/registro" class="cta-button">Empieza Ahora</router-link>
    </footer>
  </div>
</template>

<script>
import { useUserStore } from '@/store/store.js'
import { mapState } from 'pinia'
import { useAvisosStore } from '@/store/avisos'

export default {
  name: 'HomeView',
  computed: {
    ...mapState(useUserStore, ['estilos', 'usuario']),
  },
  mounted() {
    const avisos = useAvisosStore()
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  background-color: #284870;
}

/* Hero */
.hero {
  background-color: #6a1b9a;
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

/* CTA Button */
.cta-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-button:hover {
  background-color: #388e3c;
  transform: scale(1.05);
}

/* Examples */
.examples {
  margin-bottom: 3rem;
  padding: 0 30px; /* Margen horizontal simétrico */
}

.examples h2 {
  font-size: 2rem;
  color: whitesmoke;
  margin-bottom: 1.5rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  background-color: #4f8a64;
}


.example-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
  width: 80%;
  height: 80%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.example-card:hover {
  transform: scale(1.05);
}

.example-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

/* Features */
.features {
  padding: 2rem;
  background: linear-gradient(to right, #5130ad, #843d91);
  border-radius: 10px;
  border: 4px solid #ffffff;
  margin: 3rem auto; /* auto para centrar horizontalmente */
  width: 40%;
}


.features h2 {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
}

.features-list li {
  margin: 0.5rem 0;
  color: #ffffff;
}

/* Text to Image */
.text-to-image {
  background-color: #355e6c;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.text-to-image h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
}

.text-to-image p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: white;
}

/* Image to Image */
.image-to-image {
  background-color: #355e6c;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.image-to-image h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
}

.image-to-image p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: white;
}

/* Testimonios */
.testimonios {
  background-color: #355e6c;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.testimonios h2 {
  font-size: 2rem;
  color: white;
  margin-bottom: 1.5rem;
}

.testimonial-card {
  max-width: 600px;
  margin: 0 auto 1.5rem;
  background-color: #f3e5f5;
  padding: 1rem;
  border-radius: 8px;
  font-style: italic;
}

/* Footer CTA */
.final-cta {
  padding: 2rem;
  background-color: #6a1b9a;
  color: white;
  border-radius: 12px;
  margin-top: 2rem;
}

.final-cta h2 {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .features {
    width: 90%;
  }
}

</style>