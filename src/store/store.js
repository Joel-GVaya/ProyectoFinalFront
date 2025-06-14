import { defineStore } from "pinia";
import axios from "axios";
import { useAvisosStore } from "@/store/avisos";

const API_URL = "https://localhost:44377/";

export const useUserStore = defineStore("user", {
    state: () => ({
        usuario: null,
        imagenesConvertidas: [],
        estilos: [],
        nivelesAcceso: [],
        usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    }),

    getters: {
        // Puedes poner aquí getters si quieres
    },

    actions: {
        async populateEstilos() {
            try {
                const response = await axios.get(
                    "https://localhost:44328/api/estilos",
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario"))?.Token}`
                        }
                    }
                );
                this.estilos = response.data;
            } catch (error) {
                console.log("Error al obtener los estilos disponibles" + error);
            }
        },

        async transformarImagen(imageFile, estilo) {
            if (!imageFile || !(imageFile instanceof File)) {
                console.error("No se ha proporcionado una imagen válida.");
                throw new Error("No se ha proporcionado una imagen válida.");
            }

            const formData = new FormData();
            formData.append("archivo", imageFile);
            formData.append("EstiloId", estilo);

            try {
                const response = await axios.post(
                    "https://localhost:44328/api/generador/subir/imagen",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario"))?.Token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                if(response.data.exito === false) {
                    avisos.mensajeError({
                        mensaje: response.data.mensaje || "Error al procesar la imagen.",
                        tipo: "error"
                    });
                    return null;
                }
                // Retornamos el IdImagenGenerada directamente
                return response.data.IdImagenGenerada;

            } catch (error) {
                let errorMessage = "Error desconocido al procesar la imagen.";
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === "string" && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data && error.response.data.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                } else if (error.request) {
                    errorMessage = "No se pudo conectar con el servidor. Verifica la red o CORS.";
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }
                throw new Error(errorMessage);
            }
        },


        async generarImagen(prompt, estilo) {
            if (!prompt || !estilo) {
                throw new Error("Faltan parámetros para generar la imagen.");
            }

            // Prepara el formData con los campos que espera el backend
            const formData = new FormData();
            formData.append("prompt", prompt);
            formData.append("EstiloId", estilo);

            try {
                const token = JSON.parse(localStorage.getItem("usuario"))?.Token || "";

                const response = await axios.post(
                    "https://localhost:44328/api/generador/subir/texto",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                // Aquí la respuesta debería contener IdImagenGenerada según lo que diste
                if (!response.data || !response.data.IdImagenGenerada) {
                    console.error("Respuesta inesperada del servidor:", response.data);
                    throw new Error("No se recibió IdImagenGenerada.");
                }

                return response.data;

            } catch (error) {
                let errorMessage = "Error desconocido al procesar la imagen.";
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === "string" && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data && error.response.data.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                } else if (error.request) {
                    errorMessage = "No se pudo conectar con el servidor. Verifica la red o CORS.";
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }
                throw new Error(errorMessage);
            }
        },


        async publicarImagen(id) {
            if (!id) {
                console.error("No se ha proporcionado un ID válido.");
                throw new Error("No se ha proporcionado un ID válido.");
            }
            const token = JSON.parse(localStorage.getItem("usuario"))?.Token;
            if (!token) {
                throw new Error("Token no disponible. El usuario no está autenticado.");
            }

            const avisos = useAvisosStore(); // Store para mostrar avisos
            const userStore = useUserStore(); // Store para obtener token del usuario

            try {
                const response = await axios.get(
                    `https://localhost:44328/api/imagenes/publicar/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success === true) {
                    if (response.data.publicada === 1) {
                        avisos.mostrarAviso({
                            mensaje: "Imagen publicada exitosamente",
                            tipo: "success",
                        });
                    } else {
                        avisos.mostrarAviso({
                            mensaje: "Publicacion eliminada exitosamente",
                            tipo: "success",
                        });
                    }
                    return true
                } else {
                    avisos.mostrarAviso({
                        mensaje: "No se pudo publicar la imagen",
                        tipo: "error",
                    });
                    return false;
                }

            } catch (error) {
                console.error("Error al publicar la imagen:", error);
                avisos.mostrarAviso({
                    mensaje: "Error al contactar con el servidor",
                    tipo: "error",
                });
                throw error;
            }
        },

        async getImagenGeneradaByID(id) {
            if (!id) {
                console.error("No se ha proporcionado un ID válido.");
                throw new Error("No se ha proporcionado un ID válido.");
            }

            try {
                const token = JSON.parse(localStorage.getItem("usuario"))?.Token;
                if (!token) {
                    throw new Error("Token no disponible. El usuario no está autenticado.");
                }

                const response = await axios.get(`https://localhost:44328/api/imagenes/usuario/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener la imagen generada.";
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === "string" && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data?.message) {
                        errorMessage += error.response.data.message;
                    } else if (error.response.data?.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                } else if (error.request) {
                    errorMessage =
                        "No se pudo conectar con el servidor. Verifica la red o CORS.";
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }
                throw new Error(errorMessage);
            }
        },


        async getImagenesByUser() {
            const avisos = useAvisosStore(); // Opcional: para mostrar avisos si lo deseas

            try {
                const token = JSON.parse(localStorage.getItem("usuario"))?.Token;
                if (!token) {
                    throw new Error("Token no disponible. El usuario no está autenticado.");
                }

                const response = await axios.get("https://localhost:44328/api/imagenes/usuario", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener las imágenes del usuario.";
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === "string" && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data?.message) {
                        errorMessage += error.response.data.message;
                    } else if (error.response.data?.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                } else if (error.request) {
                    errorMessage = "No se pudo conectar con el servidor. Verifica la red o CORS.";
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }

                // Mostrar aviso opcional
                avisos?.mostrarAviso?.({
                    mensaje: errorMessage,
                    tipo: "error"
                });

                throw new Error(errorMessage);
            }
        },

        async getPublicaciones() {
            try {
                const response = await axios.get("https://localhost:44328/api/imagenes/publicaciones");
                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener las imagenes publicadas";
                if (error.response) {
                    errorMessage = `Error del servidor (${error.response.status}): `;
                    if (typeof error.response.data === "string" && error.response.data) {
                        errorMessage += error.response.data;
                    } else if (error.response.data && error.response.data.Message) {
                        errorMessage += error.response.data.Message;
                    } else {
                        errorMessage += error.message;
                    }
                } else if (error.request) {
                    errorMessage =
                        "No se pudo conectar con el servidor. Verifica la red o CORS.";
                } else {
                    errorMessage = `Error de configuración: ${error.message}`;
                }
                throw new Error(errorMessage);
            }
        },


        async eliminarImagen(id) {
            if (!id) throw new Error("ID de imagen inválido.");

            const avisos = useAvisosStore(); // ✅ Store de avisos
            const token = JSON.parse(localStorage.getItem("usuario"))?.Token;

            if (!token) {
                avisos.mostrarAviso({
                    mensaje: "No se pudo autenticar al usuario.",
                    tipo: "error"
                });
                throw new Error("Token no disponible. El usuario no está autenticado.");
            }

            try {
                const response = await axios.delete(`https://localhost:44328/api/imagenes/usuario/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                avisos.mostrarAviso({
                    mensaje: response.data || "Imagen eliminada exitosamente",
                    tipo: "success"
                });
            } catch (error) {
                console.error("Error al eliminar la imagen:", error);

                let mensajeError = "No se pudo eliminar la imagen.";
                if (error.response?.data) {
                    mensajeError = typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data.message || mensajeError;
                }

                avisos.mostrarAviso({
                    mensaje: mensajeError,
                    tipo: "error"
                });

                throw error;
            }
        },

        async crearUsuario(nuevoUsuario) {
            try {
                const response = await axios.post(
                    "https://localhost:44328/api/usuarios/registrar",
                    nuevoUsuario
                );

                console.log("Usuario creado:", response.data.mensaje);
            } catch (error) {
                console.error("Error al crear el usuario:", error.response?.data?.mensaje || error.message);
            }
        },

        async editarUsuario(id, datosActualizados) {
            try {
                await axios.put(
                    `http://localhost:3000/usuarios/${id}`,
                    datosActualizados
                );
                this.setUsuario(datosActualizados);
                console.log("Datos actualizados:", datosActualizados);
            } catch (error) {
                console.error("Error al editar el usuario:", error);
            }
        },

        async actualizarUsuario(usuarioActualizado) {
            try {
                const response = await axios.put(
                    "https://localhost:44328/api/usuarios",
                    usuarioActualizado,
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario"))?.Token}`
                        }
                    }
                );
                this.actualizarUsuarioLocalStorage(usuarioActualizado);
                return response.data; // o cualquier cosa que necesites devolver
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("No autorizado");
                } else {
                    console.error("Error al actualizar usuario:", error);
                }
                return null;
            }
        },

        async iniciarSesion(correo, password) {
            try {
                const response = await axios.post(
                    "https://localhost:44328/api/usuarios/login",
                    {
                        correo: correo,
                        password: password
                    }
                );

                // La API responde con { Mensaje, Token, Usuario }
                const { Token, Usuario } = response.data;

                if (Token && Usuario) {
                    // Guardamos el usuario junto al token en localStorage
                    this.setUsuario({ ...Usuario, Token });
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Login incorrecto
                    return false;
                }
                console.error("Error al iniciar sesión:", error);
                return false;
            }
        },

        setUsuario(usuario) {
            this.usuario = usuario;
            if (usuario) {
                localStorage.setItem("usuario", JSON.stringify(usuario));
            } else {
                localStorage.removeItem("usuario");
            }
        },


        cerrarSesion() {
            this.setUsuario(null);
        },


        actualizarUsuarioLocalStorage(datosNuevos) {
            const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {}

            // Mapeamos claves de datosNuevos a formato del localStorage
            const datosConvertidos = {
                Nombre: datosNuevos.nombre,
                Apellidos: datosNuevos.apellidos,
                Correo: datosNuevos.correo,
                Edad: datosNuevos.edad,
                Telefono: datosNuevos.telefono,
                Imagen: datosNuevos.imagen,
                NivelAcceso: datosNuevos.nivelAcceso ?? usuarioGuardado.NivelAcceso,
                Id: usuarioGuardado.Id, // mantener
                Token: usuarioGuardado.Token // mantener
            }

            const usuarioActualizado = {
                ...usuarioGuardado,
                ...datosConvertidos
            }
            this.usuario = usuarioActualizado
            // Actualizamos el localStorage
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
            this.usuario = usuarioActualizado
        },

        async verificarContrasena(passwd) {
            try {
                const token = JSON.parse(localStorage.getItem("usuario"))?.Token;
                if (!token) throw new Error("Usuario no autenticado");

                const response = await axios.post(
                    "https://localhost:44328/api/usuarios/verificarContrasena",
                    { passwd },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Devuelve el resultado para que el componente pueda usarlo
                return response.data;
            } catch (error) {
                console.error("Error al verificar la contraseña:", error);
                // Opcional: podrías devolver un objeto con exito: false para manejar errores
                return { Exito: false, Mensaje: error.response?.data?.Mensaje || error.message };
            }
        }




    },
});
