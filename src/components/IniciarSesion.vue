<template>
    <div class="iniciar-sesion">
        <h1>Iniciar Sesión</h1>
        <form @submit.prevent="handleLogin" class="form-container">
            <div class="form-group">
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" v-model="email" required />
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Iniciar Sesión</button>
            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/store.js'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
    const success = await store.iniciarSesion(email.value, password.value)
    if (!success) {
        error.value = 'Usuario o contraseña incorrectos.'
    } else {
        error.value = ''
        router.push('/') // Redirigir al Home
    }
}
</script>

<style scoped>
.iniciar-sesion {
    text-align: center;
    margin-top: 4rem;
}

h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
}

.form-container {
    background-color: #f4f4f4;
    /* Fondo ligeramente diferente */
    padding: 2rem;
    border-radius: 12px;
    /* Bordes redondeados */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Sombra */
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
}

button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
}

.error {
    color: red;
    margin-top: 1rem;
}
</style>