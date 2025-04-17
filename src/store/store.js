import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://localhost:44304/';

export const useUserStore = defineStore('user', {
    state: () => ({
        usuarios: [],
        usuarioAutenticado: null,
        imagenesConvertidas: [],
    }),

    actions: {

        async generarLineArt(imageFile) {
            if (!imageFile || !(imageFile instanceof File)) {
                console.error('No se ha proporcionado una imagen válida.');
                throw new Error('No se ha proporcionado una imagen válida.');
            }

            const formData = new FormData();
            formData.append('image', imageFile, imageFile.name);
        
            console.log(`Intentando subir imagen: ${imageFile.name}`);
        
            try {
                const response = await axios.post(API_URL + 'api/Dibujos/subir/imagen', formData, {
                });
                console.log('Imagen subida y procesada con éxito:', response.data);
                return response.data;
        
            } catch (error) {
                console.error('Error al subir/procesar la imagen:', error);
        
                let errorMessage = 'Error desconocido al procesar la imagen.';
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === 'string' && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data && error.response.data.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                    console.error('Detalles del error:', error.response.data);
                } else if (error.request) {
                    errorMessage = 'No se pudo conectar con el servidor. Verifica la red o CORS.';
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }
                throw new Error(errorMessage);
            }
        },
        async fetchUsuarios() {
            try {
                const response = await axios.get('http://localhost:3000/usuarios')
                this.usuarios = response.data
            } catch (error) {
                console.error('Error al obtener los usuarios:', error)
            }
        },

        async crearUsuario(nuevoUsuario) {
            try {
                const response = await axios.post('http://localhost:3000/usuarios', nuevoUsuario)
                this.usuarios.push(response.data)
                localStorage.setItem('usuario', JSON.stringify(response.data))
                this.usuarioAutenticado = response.data
            } catch (error) {
                console.error('Error al crear el usuario:', error)
            }
        },

        async editarUsuario(id, datosActualizados) {
            try {
                await axios.put(`http://localhost:3000/usuarios/${id}`, datosActualizados)
            } catch (error) {
                console.error('Error al editar el usuario:', error)
            }
        },

        async eliminarUsuario(id) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`)
                this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id)
                alert('Usuario eliminado exitosamente')
            } catch (error) {
                console.error('Error al eliminar el usuario:', error)
            }
        },

        async iniciarSesion(correo, password) {
            try {
                const response = await axios.get('http://localhost:3000/usuarios')
                const usuario = response.data.find(
                    (u) =>
                        u.correo.trim().toLowerCase() === correo.trim().toLowerCase() &&
                        u.password === password
                )

                if (usuario) {
                    localStorage.setItem('usuario', JSON.stringify(usuario))
                    this.usuarioAutenticado = usuario
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error)
                return false
            }
        },

        verificarUsuarioAutenticado() {
            const usuario = localStorage.getItem('usuario')
            this.usuarioAutenticado = usuario ? JSON.parse(usuario) : null
        },

        // Cerrar sesión
        cerrarSesion() {
            localStorage.removeItem('usuario')
            this.usuarioAutenticado = null
        },

        

    },

})