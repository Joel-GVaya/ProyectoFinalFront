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
                    "https://localhost:44328/api/Generador1/subir/imagen",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("usuario"))?.Token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

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

            try {
                const response = await axios.post(
                    API_URL + "api/Dibujos/subir/texto",
                    { promptUsuario: prompt }  // JSON directo
                );


                await new Promise(resolve => setTimeout(resolve, 1000));

                if (!response.data || !response.data.nombreArchivo) {
                    console.error("Respuesta inesperada del servidor:", response.data);
                };
                const respuesta = await this.getAPIImagenGeneradaById(response.data.nombreArchivo);
                if (!respuesta || !respuesta.imagenBase64) {
                    console.error("No se pudo obtener la imagen generada.");
                    throw new Error("No se pudo obtener la imagen generada.");
                } else {
                    this.guardarImagenBase64(response.data.nombreArchivo, respuesta.imagenBase64, estilo);
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
                    errorMessage =
                        "No se pudo conectar con el servidor. Verifica la red o CORS.";
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

        async guardarImagenBase64(id, imagenBase64, estilo) {
            if (!imagenBase64) throw new Error("Imagen inválida.");
            if (!this.usuario || !this.usuario.id)
                throw new Error("Usuario no autenticado.");

            const nuevaImagen = {
                id: id,
                id_usuario: this.usuario.id,
                publicada: false,
                fecha: new Date().toISOString(),
                estilo: estilo || "default",
                imagen_base64: imagenBase64,
            };

            try {
                const response = await axios.post(
                    "http://localhost:3000/imagenes",
                    nuevaImagen
                );
                return response.data;
            } catch (error) {
                console.error("Error al guardar la imagen:", error);
                throw new Error("No se pudo guardar la imagen.");
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

        async getImagenesGeneradasHoy(usuarioId) {
            try {
                const hoy = new Date().toISOString().split('T')[0]; // "2025-06-09"
                const response = await fetch(`http://localhost:3000/imagenes?id_usuario=${usuarioId}`);
                const imagenes = await response.json();

                // Filtramos las imágenes cuya fecha sea de hoy (por día, no por hora)
                const imagenesHoy = imagenes.filter(img => {
                    const fechaImg = new Date(img.fecha).toISOString().split('T')[0];
                    return fechaImg === hoy;
                });

                return imagenesHoy.length;
            } catch (error) {
                console.error('Error al contar imágenes de hoy:', error);
                return 0;
            }
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
        }



    },
});
