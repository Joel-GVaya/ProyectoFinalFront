<template>
    <div class="home">
        <header class="hero">
            <h1>Descubre el Poder de Dibujos Colorear</h1>
            <p>Convierte tus imágenes en obras de arte únicas o genera imágenes increíbles a partir de texto.</p>
            <router-link to="/registro" class="cta-button">¡Regístrate y Prueba Ahora!</router-link>
        </header>

        <section class="examples">
            <h2>Explora Nuestros Estilos</h2>
            <div class="examples-grid">
                <div class="example-card" v-for="ejemplo in ejemplos" :key="ejemplo.id">
                    <img :src="ejemplo.imagen" :alt="ejemplo.nombre" class="example-image" />
                    <p>{{ ejemplo.nombre }}</p>
                </div>
            </div>
        </section>

        <section class="text-to-image">
            <h2>Genera Imágenes a Partir de Texto</h2>
            <p>Escribe una descripción y observa cómo nuestra IA la convierte en una imagen impresionante.</p>
            <router-link to="/generar-imagen" class="cta-button">Prueba la Generación de Texto a Imagen</router-link>
        </section>
    </div>
</template>

<script setup>
import lineArtExample from '@/assets/Estilos/LineArt.jpg'
import animeExample from '@/assets/Estilos/LineArt.jpg'
import pixarExample from '@/assets/Estilos/LineArt.jpg'

const ejemplos = [
    { id: 1, nombre: 'LineArt', imagen: lineArtExample },
    { id: 2, nombre: 'Anime', imagen: animeExample },
    { id: 3, nombre: 'Pixar', imagen: pixarExample }
]
</script>

<style scoped>
/* Estilo general del Home */
.home {
    text-align: center;
    padding: 2rem;
    background-color: #f5f5f5; /* Gris claro */
}

/* Hero Section */
.hero {
    background-color: #6a1b9a; /* Morado */
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

.cta-button {
    background-color: #4caf50; /* Verde */
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-button:hover {
    background-color: #388e3c; /* Verde más oscuro */
    transform: scale(1.05);
}

/* Examples Section */
.examples {
    margin-bottom: 3rem;
}

.examples h2 {
    font-size: 2rem;
    color: #6a1b9a; /* Morado */
    margin-bottom: 1.5rem;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.example-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    text-align: center;
    transition: transform 0.3s ease;
}

.example-card:hover {
    transform: scale(1.05);
}

.example-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

/* Text-to-Image Section */
.text-to-image {
    background-color: #d1c4e9; /* Morado claro */
    padding: 2rem;
    border-radius: 12px;
}

.text-to-image h2 {
    font-size: 2rem;
    color: #6a1b9a; /* Morado */
    margin-bottom: 1rem;
}

.text-to-image p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}
</style>