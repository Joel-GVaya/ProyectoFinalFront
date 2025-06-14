<template>
    <div class="body">
    <div class="planes">
        <h1>Planes de pago!</h1>
        <div class="planes-list">
            <div class="plan">
                <div class="plan-content">
                    <div class="plan-icon">📦</div>
                    <h2>Plan Básico</h2>
                    <ul>
                        <li>✔ Acceso limitado</li>
                        <li>✔ Herramientas básicas</li>
                        <li>✖ Funciones avanzadas</li>
                    </ul>
                    <button>Seleccionar</button>
                </div>
            </div>

            <div class="plan">
                <div class="plan-content">
                    <div class="plan-icon">🚀</div>
                    <h2>Plan Premium</h2>
                    <ul>
                        <li>✔ Acceso completo</li>
                        <li>✔ Herramientas avanzadas</li>
                        <li>✔ Prioridad de soporte</li>
                    </ul>
                    <button>Seleccionar</button>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>



<script setup>
</script>

<style scoped>

.body {
  background-color: #284870;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.planes {
    text-align: center;
    margin-top: 100px;
}

.planes h1{
    color: #f4f4f4;
    font-style: initial 24px solid white;
}

.planes-list {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    max-width: 1200px;
}

.plan {
    background-color: #f4f4f4;
    padding: 2rem;
    border-radius: 12px;
    border: 4px solid #92d27f;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.plan-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.plan-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.plan h2 {
    margin: 0 0 1rem;
    color: #333;
}

.plan ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem;
    text-align: left;
}

.plan ul li {
    margin-bottom: 0.5rem;
}

button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
}
</style>
