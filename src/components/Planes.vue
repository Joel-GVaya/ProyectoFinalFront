<template>
    <div class="planes">
        <h1>Planes</h1>
        <div class="planes-list">
            <div class="plan">
                <h2>Plan Básico</h2>
                <p>Acceso limitado a herramientas básicas.</p>
                <button>Seleccionar</button>
            </div>
            <div class="plan">
                <h2>Plan Premium</h2>
                <p>Acceso completo a todas las herramientas y funciones avanzadas.</p>
                <button>Seleccionar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.planes {
    text-align: center;
    margin-top: 4rem;
}

.planes-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
}

.plan {
    background-color: #f4f4f4;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
}

.plan h2 {
    margin: 0 0 0.5rem;
}

.plan p {
    margin: 0 0 1rem;
}

button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
}
</style>