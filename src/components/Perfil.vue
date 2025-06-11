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
                <input type="password" id="nueva-password" v-model="nuevaPassword" :disabled="!credencialesEditables"
                    placeholder="Introduce tu nueva contraseña" />
            </div>
            <div class="form-group" v-if="credencialesEditables">
                <label for="confirmar-password">Confirmar nueva contraseña:</label>
                <input type="password" id="confirmar-password" v-model="confirmarPassword"
                    placeholder="Confirma tu nueva contraseña" />
            </div>
            <div class="form-group imagen-group">
                <label for="imagen">Foto de perfil:</label>
                <img v-if="imagen" :src="imagen" alt="preview" class="imagen-preview" /><br>
                <input type="file" id="imagen" accept="image/*" @change="handleImage" />
                <button v-if="imagen" type="button" class="delete-image-button" @click="eliminarImagen">
                    Eliminar imagen
                </button>
            </div>
            <div class="form-actions">
                <button v-if="!credencialesEditables" type="button" class="modify-button"
                    @click="mostrarVerificacion = true">
                    Modificar correo y/o contraseña
                </button>
                <button type="button" class="save-button" @click="guardarCambios">
                    Guardar Cambios
                </button>
            </div>
        </form>

        <!-- Verificación sin modal -->
        <div v-if="mostrarVerificacion" class="verificacion">
            <h2>Verificación</h2>
            <p>Introduce tu contraseña actual para habilitar la edición:</p>
            <input type="password" v-model="password" placeholder="Contraseña actual" />
            <div class="verificacion-actions">
                <button @click="verificarCredenciales">Confirmar</button>
                <button @click="cerrarVerificacion">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '@/store/store.js'
import { mapActions } from "pinia"
import { useAvisosStore } from '@/store/avisos'

export default {
    name: 'Perfil',

    data() {
        const usuario = JSON.parse(localStorage.getItem("usuario")) || null
        return {
            usuario,
            nombre: usuario?.Nombre || '',
            apellidos: usuario?.Apellidos || '',
            edad: usuario?.Edad || null,
            telefono: usuario?.Telefono || '',
            correo: usuario?.Correo || '',
            imagen: usuario?.Imagen || '',
            nuevaPassword: '',
            confirmarPassword: '',
            password: '',
            credencialesEditables: false,
            mostrarVerificacion: false,
        }
    },

    computed: {
        avisos() {
            return useAvisosStore();  // Esto te dará acceso al store directamente
        }
    },

    methods: {
        ...mapActions(useUserStore, ["iniciarSesion"]),

        handleImage(e) {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = ev => {
                this.imagen = ev.target.result
            }
            reader.readAsDataURL(file)
        },

        eliminarImagen() {
            this.imagen = ''
        },

        async guardarCambios() {
            const avisos = useAvisosStore()

            if (!this.nombre || !this.apellidos || !this.edad || !this.telefono || !this.correo) {
                avisos.mostrarAviso({ mensaje: 'Por favor, completa todos los campos obligatorios.', tipo: 'info' })
                return
            }

            if (this.nuevaPassword && this.nuevaPassword !== this.confirmarPassword) {
                avisos.mostrarAviso({ mensaje: 'Las contraseñas no coinciden.', tipo: 'error' })
                return
            }

            if (this.nuevaPassword && this.nuevaPassword.length < 6) {
                avisos.mostrarAviso({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres.', tipo: 'error' })
                return
            }

            try {
                const datosActualizados = {
                    nombre: this.nombre,
                    apellidos: this.apellidos,
                    correo: this.correo,
                    edad: this.edad,
                    telefono: this.telefono,
                    password: this.nuevaPassword !== '' ? this.nuevaPassword : this.usuario.password,
                    nivelAcceso: this.usuario.NivelAcceso,
                    imagen: this.imagen,
                }

                const userStore = useUserStore()
                await userStore.actualizarUsuario(datosActualizados)

                avisos.mostrarAviso({ mensaje: 'Datos actualizados correctamente.', tipo: 'info' })

                Object.assign(this.usuario, datosActualizados)
                this.nuevaPassword = ''
                this.confirmarPassword = ''
                this.credencialesEditables = false

                setTimeout(() => window.location.reload(), 500)
            } catch (e) {
                avisos.mostrarAviso({ mensaje: 'Error al guardar los cambios.', tipo: 'error' })
            }
        },

        verificarCredenciales() {
            const avisos = useAvisosStore()
            if (this.password === this.usuario.password) {
                this.credencialesEditables = true
                this.mostrarVerificacion = false
                this.password = ''
            } else {
                avisos.mostrarAviso({ mensaje: 'Contraseña incorrecta.', tipo: 'error' })
            }
        },

        cerrarVerificacion() {
            this.mostrarVerificacion = false
            this.password = ''
        },
    },
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
    grid-template-columns: 1fr 1fr;
    /* Dos columnas iguales */
    gap: 1.5rem;
    /* Espacio entre columnas y filas */
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
    width: 100%;
    margin-bottom: 1rem;
}

/* Imagen de perfil */
.imagen-group {
    grid-column: span 2;
    /* Ocupa ambas columnas */
    text-align: center;
}

.imagen-preview {
    max-width: 100px;
    max-height: 100px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    align-self: center;
    /* Centrar la imagen */
}

/* Botones */
.form-actions {
    grid-column: span 2;
    /* Hacer que los botones ocupen ambas columnas */
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

.verificacion {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    text-align: center;
}

.verificacion h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

.verificacion p {
    margin-bottom: 1rem;
    color: #34495e;
}

.verificacion input {
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    width: 100%;
    margin-bottom: 1rem;
}

.verificacion-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.verificacion-actions button {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.verificacion-actions button:first-child {
    background-color: #4caf50;
    color: white;
}

.verificacion-actions button:last-child {
    background-color: #e74c3c;
    color: white;
}
</style>