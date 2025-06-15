<template>
    <div class="about-us">
        <section class="hero">
            <h1>Sobre Nosotros</h1>
            <p>En PixAlchemy, creemos que la creatividad no tiene edad.</p>
        </section>

        <section class="section">
            <h2>¿Qué es PixAlchemy?</h2>
            <p>
                Es una plataforma interactiva donde puedes <strong>generar imágenes personalizadas</strong> a partir de
                texto o transformar tus propias imágenes en dibujos para colorear. Está diseñada para niños, familias,
                educadores y cualquier persona con ganas de crear.
            </p>
        </section>

        <section class="section">
            <h2>¿Cómo funciona?</h2>
            <ul class="features-list">
                <li>🖍️ Usa IA para generar imágenes únicas a partir de texto o imagen.</li>
                <li>🎨 Ofrece estilos variados para que cada creación sea especial.</li>
                <li>🔒 Incluye niveles de acceso para controlar el uso responsable.</li>
                <li>📱 Totalmente accesible desde móviles y tablets.</li>
            </ul>
        </section>

        <section class="section mission">
            <h2>Nuestra misión</h2>
            <p>
                Fomentar la imaginación, el aprendizaje visual y el arte digital mediante una
                herramienta educativa, divertida y fácil de usar. Queremos que todos puedan
                <strong>crear sin límites</strong>.
            </p>
        </section>

        <footer class="final-cta">
            <h2>Únete a nuestra comunidad creativa</h2>
            <router-link to="/registro" class="cta-button">Empieza Ahora</router-link>
        </footer>
    </div>
</template>

<script setup>
// No se requiere lógica aquí
</script>

<style scoped>
.about-us {
    margin-top: 5vh;
    min-height: 95vh;
    /* ocupa al menos toda la altura de la ventana */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* para distribuir el contenido */
    padding: 2rem;
    background-color: #284870;
    color: white;
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
}


/* Hero */
.hero {
    background-color: #6a1b9a;
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
}

/* Sections */
.section {
    background-color: #355e6c;
    padding: 2rem;
    margin: 2rem 0;
    border-radius: 12px;
}

.section h2 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1rem;
}

.section p {
    font-size: 1.1rem;
    color: #e0e0e0;
}

/* Features list */
.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.1rem;
}

.features-list li {
    margin-bottom: 0.8rem;
}

/* Mission */
.mission p {
    font-style: italic;
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

/* Final CTA */
.final-cta {
    margin-top: 3rem;
    background-color: #6a1b9a;
    padding: 2rem;
    border-radius: 12px;
}

.final-cta h2 {
    margin-bottom: 1rem;
}
</style>
