import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
    state: () => ({
        usuarios: [], // Lista de usuarios
        usuarioAutenticado: null, // Usuario autenticado
        imagenesConvertidas: [] // Lista de imágenes convertidas
    }),

    actions: {
        // Obtener todos los usuarios
        async fetchUsuarios() {
            try {
                const response = await axios.get('http://localhost:3000/usuarios')
                this.usuarios = response.data
            } catch (error) {
                console.error('Error al obtener los usuarios:', error)
            }
        },

        // Crear un nuevo usuario
        async crearUsuario(nuevoUsuario) {
            try {
                const response = await axios.post('http://localhost:3000/usuarios', nuevoUsuario)
                this.usuarios.push(response.data) // Añadir el nuevo usuario a la lista local
                localStorage.setItem('usuario', JSON.stringify(response.data)) // Guardar el usuario en localStorage
                this.usuarioAutenticado = response.data // Actualizar el estado del usuario autenticado
            } catch (error) {
                console.error('Error al crear el usuario:', error)
            }
        },

        // Editar un usuario existente
        async editarUsuario(id, datosActualizados) {
            try {
                await axios.put(`http://localhost:3000/usuarios/${id}`, datosActualizados)
            } catch (error) {
                console.error('Error al editar el usuario:', error)
            }
        },

        // Eliminar un usuario
        async eliminarUsuario(id) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`)
                this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id) // Eliminar el usuario de la lista local
                alert('Usuario eliminado exitosamente')
            } catch (error) {
                console.error('Error al eliminar el usuario:', error)
            }
        },

        // Iniciar sesión
        async iniciarSesion(correo, password) {
            try {
                const response = await axios.get('http://localhost:3000/usuarios')
                const usuario = response.data.find(
                    (u) =>
                        u.correo.trim().toLowerCase() === correo.trim().toLowerCase() &&
                        u.password === password
                )

                if (usuario) {
                    localStorage.setItem('usuario', JSON.stringify(usuario)) // Guardar el usuario en localStorage
                    this.usuarioAutenticado = usuario // Actualizar el estado del usuario autenticado
                    return true // Inicio de sesión exitoso
                } else {
                    return false // Usuario o contraseña incorrectos
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error)
                return false
            }
        },

        // Verificar si hay un usuario autenticado en localStorage
        verificarUsuarioAutenticado() {
            const usuario = localStorage.getItem('usuario')
            this.usuarioAutenticado = usuario ? JSON.parse(usuario) : null
        },

        // Cerrar sesión
        cerrarSesion() {
            localStorage.removeItem('usuario') // Eliminar el usuario del localStorage
            this.usuarioAutenticado = null // Limpiar el estado del usuario autenticado
        },

        // Guardar imagen convertida
        async guardarImagenConvertida(imagen, estilo) {
            try {
                const nuevaImagen = {
                    imagen, // Base64 de la imagen
                    estilo, // Nombre del estilo seleccionado
                    usuarioId: this.usuarioAutenticado?.id || null // ID del usuario autenticado (si existe)
                }
                const response = await axios.post('http://localhost:3000/imagenesConvertidas', nuevaImagen)
                this.imagenesConvertidas.push(response.data) // Añadir la imagen a la lista local
                alert('Imagen convertida y guardada exitosamente.')
            } catch (error) {
                console.error('Error al guardar la imagen convertida:', error)
                alert('Hubo un error al guardar la imagen.')
            }
        }
    }
})