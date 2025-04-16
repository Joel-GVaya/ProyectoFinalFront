<template>
    <div class="perfil">
        <h1>Perfil</h1>
        <form class="perfil-form">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" v-model="nombre" />
            </div>
                <div class="form-group">
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" v-model="apellidos" />
            </div>
            <div class="form-group">
                <label for="edad">Edad:</label>
                <input type="number" id="edad" v-model="edad" />
            </div>
            <div class="form-group">
                <label for="telefono">Teléfono:</label>
                <input type="tel" id="telefono" v-model="telefono" />
            </div>
            <div class="form-group">
                <label for="correo">Correo electrónico:</label>
                <input type="email" id="correo" v-model="correo" :disabled="!credencialesEditables" />
            </div>
            <div class="form-group">
                <label for="nueva-password">Nueva contraseña:</label>
                <input
                    type="password"
                    id="nueva-password"
                    v-model="nuevaPassword"
                    :disabled="!credencialesEditables"
                    placeholder="Introduce tu nueva contraseña"
                />
            </div>
            <div class="form-group imagen-group">
                <label for="imagen">Foto de perfil:</label>
                <input type="file" id="imagen" accept="image/*" @change="handleImage" />
                <img
                    v-if="imagen"
                    :src="imagen"
                    alt="preview"
                    class="imagen-preview"
                />
                <button
                    v-if="imagen"
                    type="button"
                    class="delete-image-button"
                    @click="eliminarImagen"
                >
                    Eliminar imagen
                </button>
            </div>
            <div class="form-actions">
                <button
                    v-if="!credencialesEditables"
                    type="button"
                    class="modify-button"
                    @click="mostrarVerificacion = true"
                >
                    Modificar correo y/o contraseña
                </button>
                <button type="button" class="save-button" @click="guardarCambios">
                    Guardar Cambios
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/store.js'

const store = useUserStore()

const nombre = ref(store.usuarioAutenticado.nombre)
const apellidos = ref(store.usuarioAutenticado.apellidos || '') // Nuevo campo
const edad = ref(store.usuarioAutenticado.edad)
const telefono = ref(store.usuarioAutenticado.telefono)
const correo = ref(store.usuarioAutenticado.correo)
const nuevaPassword = ref('')
const imagen = ref(store.usuarioAutenticado.imagen || '')
const password = ref('')
const error = ref('')

const credencialesEditables = ref(false)
const mostrarVerificacion = ref(false)

const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
        imagen.value = ev.target.result
    }
    reader.readAsDataURL(file)
}

const eliminarImagen = () => {
    imagen.value = ''
}

const guardarCambios = async () => {
    try {
        const datosActualizados = {
            id: store.usuarioAutenticado.id,
            nombre: nombre.value,
            apellidos: apellidos.value, // Guardar apellidos
            correo: correo.value,
            edad: edad.value,
            telefono: telefono.value,
            imagen: imagen.value,
            password: nuevaPassword.value !== '' ? nuevaPassword.value : store.usuarioAutenticado.password,
        }
        await store.editarUsuario(datosActualizados.id, datosActualizados)
        Object.assign(store.usuarioAutenticado, datosActualizados)
        credencialesEditables.value = false
        nuevaPassword.value = ''
        alert('Cambios guardados exitosamente.')
    } catch (e) {
        alert('Error al guardar los cambios.')
    }
}
</script>

<style scoped>
/* Fondo general */
.perfil {
    background-color: #f9f9f9;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 900px;
    margin: 2rem auto;
}

/* Título */
h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

/* Formulario */
.perfil-form {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Dos columnas iguales */
    gap: 1.5rem; /* Espacio entre columnas y filas */
}

/* Grupos de formulario */
.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #34495e;
}

input {
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
}

/* Imagen de perfil */
.imagen-group {
    grid-column: span 2; /* Ocupa ambas columnas */
    text-align: center;
}

.imagen-preview {
    max-width: 100px;
    max-height: 100px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Botones */
.form-actions {
    grid-column: span 2; /* Hacer que los botones ocupen ambas columnas */
    display: flex;
    justify-content: center;
    gap: 1rem;
}

button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.modify-button {
    background-color: #3498db;
    color: white;
}

.modify-button:hover {
    background-color: #2980b9;
    transform: scale(1.05);
}

.save-button {
    background-color: #2ecc71;
    color: white;
}

.save-button:hover {
    background-color: #27ae60;
    transform: scale(1.05);
}

.delete-image-button {
    background-color: #e74c3c;
    color: white;
    margin-top: 10px;
}

.delete-image-button:hover {
    background-color: #c0392b;
    transform: scale(1.05);
}
</style>