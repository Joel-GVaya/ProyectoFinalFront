<template>
    <div class="registro">
        <h1>Registro</h1>
        <form @submit.prevent="handleRegister" class="form-container">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" v-model="nombre" required />
            </div>
            <div class="form-group">
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" v-model="apellidos" required />
            </div>
            <div class="form-group">
                <label for="correo">Correo Electrónico:</label>
                <input type="email" id="correo" v-model="correo" required />
            </div>
            <div class="form-group">
                <label for="edad">Edad:</label>
                <input type="number" id="edad" v-model="edad" required />
            </div>
            <div class="form-group">
                <label for="telefono">Número de Teléfono:</label>
                <input type="tel" id="telefono" v-model="telefono" required />
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirmar Contraseña:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required />
            </div>
            <div class="form-group">
                <label for="imagen">Imagen de perfil:</label>
                <input type="file" id="imagen" accept="image/*" @change="handleImage" />
                <img v-if="imagen" :src="imagen" alt="preview" style="max-width:100px;max-height:100px;margin-top:10px;" />
            </div>
            <button type="submit">Registrarse</button>
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

const nombre = ref('')
const apellidos = ref('') // Nuevo campo
const correo = ref('')
const edad = ref('')
const telefono = ref('')
const password = ref('')
const confirmPassword = ref('')
const imagen = ref('')
const error = ref('')

const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
        imagen.value = ev.target.result
    }
    reader.readAsDataURL(file)
}

const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden.'
        return
    }

    const nuevoUsuario = {
        nombre: nombre.value,
        apellidos: apellidos.value, // Guardar apellidos
        correo: correo.value,
        edad: parseInt(edad.value),
        telefono: telefono.value,
        password: password.value,
        imagen: imagen.value
    }

    try {
        await store.crearUsuario(nuevoUsuario)
        alert('Registro exitoso')
        router.push('/')
    } catch (err) {
        console.error('Error al registrar el usuario:', err)
    }
}
</script>

<style scoped>
.registro {
    text-align: center;
    margin-top: 4rem;
}

h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
}

.form-container {
    background-color: #f4f4f4;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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