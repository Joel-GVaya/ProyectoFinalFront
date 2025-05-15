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
import { mapStores, mapActions } from "pinia";

export default {
    name: 'Perfil',

    data() {
        // Obtén el usuario del localStorage
        const usuario = JSON.parse(localStorage.getItem("usuario")) || null;

        return {
            usuario,  // Se guarda como propiedad en data()
            nombre: usuario ? usuario.nombre : '',
            apellidos: usuario ? usuario.apellidos : '',
            edad: usuario ? usuario.edad : null,
            telefono: usuario ? usuario.telefono : '',
            correo: usuario ? usuario.correo : '',
            imagen: usuario ? usuario.imagen : '',
            nuevaPassword: '',
            confirmarPassword: '',
            password: '',
            error: '',
            credencialesEditables: false,
            mostrarVerificacion: false,
        }
    },


    methods: {
        ...mapActions(useUserStore, ["iniciarSesion"]),
        handleImage(e) {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = (ev) => {
                this.imagen = ev.target.result
            }
            reader.readAsDataURL(file)
        },

        eliminarImagen() {
            this.imagen = ''
        },

        guardarCambios() {
            // Validaciones básicas
            if (!this.nombre || !this.apellidos || !this.edad || !this.telefono || !this.correo) {
                alert('Por favor, completa todos los campos obligatorios.')
                return
            }

            // Validación de la nueva contraseña
            if (this.nuevaPassword && this.nuevaPassword !== this.confirmarPassword) {
                alert('Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.')
                return
            }

            // Validación de contraseña mínima (si se incluye una nueva contraseña)
            if (this.nuevaPassword && this.nuevaPassword.length < 6) {
                alert('La nueva contraseña debe tener al menos 6 caracteres.')
                return
            }

            try {
                // Datos actualizados
                const datosActualizados = {
                    id: this.usuario.id,
                    nombre: this.nombre,
                    apellidos: this.apellidos,
                    correo: this.correo,
                    edad: this.edad,
                    telefono: this.telefono,
                    password: this.nuevaPassword !== '' ? this.nuevaPassword : this.usuario.password, // Si no hay nueva contraseña, se mantiene la actual
                    imagen: this.imagen, // Foto de perfil
                }

                const userStore = useUserStore();

                // Llamada a la acción de Pinia para editar el usuario
                userStore.editarUsuario(datosActualizados.id, datosActualizados);

                // Actualizar la información del usuario en el store
                Object.assign(this.usuario, datosActualizados)

                // Limpiar los campos de contraseña
                this.nuevaPassword = ''
                this.confirmarPassword = ''

                // Cerrar la edición de credenciales
                this.credencialesEditables = false

                // Notificación de éxito
                alert('Cambios guardados exitosamente.')
            } catch (e) {
                // Manejo de errores
                console.error('Error al guardar los cambios:', e)
                alert('Error al guardar los cambios. Por favor, intenta nuevamente.')
            }
        },

        verificarCredenciales() {
            if (this.password === this.usuario.password) {
                this.credencialesEditables = true
                this.mostrarVerificacion = false
                this.password = ''
            } else {
                alert('Contraseña incorrecta.')
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