import { defineStore } from "pinia";
import axios from "axios";
import { useAvisosStore } from "@/store/avisos";

const API_URL = "https://localhost:44377/";

export const useUserStore = defineStore("user", {
    state: () => ({
        usuarios: [],
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
                    "http://localhost:3000/estilosDisponibles"
                );
                this.estilos = response.data;
            } catch (error) {
                console.log("Error al obtener los estilos disponibles" + error);
            }
        },

        async transformarImagen(imageFile, estilo) {
            const avisos = useAvisosStore();
            if (!(await this.comprobarSiPuedeGenerarImagen())) {
                avisos.mostrarAviso({
                    mensaje: "Ya has alcanzado el límite diario de imágenes permitidas.",
                    tipo: "error"
                });
                return false;
            }

            if (!imageFile || !(imageFile instanceof File)) {
                console.error("No se ha proporcionado una imagen válida.");
                throw new Error("No se ha proporcionado una imagen válida.");
            }

            const formData = new FormData();
            formData.append("image", imageFile, imageFile.name);

            try {
                const response = await axios.post(
                    API_URL + "api/Dibujos/subir/imagen",
                    formData
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

        async generarImagen(prompt, estilo) {
            if (!(await this.comprobarSiPuedeGenerarImagen())) {
                return false;
            }

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

            const avisos = useAvisosStore(); // ✅ Instancia local del store de avisos

            try {
                const response = await axios.patch(
                    `http://localhost:3000/imagenes/${id}`,
                    { publicada: true }
                );
                avisos.mostrarAviso({
                    mensaje: "Imagen publicada exitosamente",
                    tipo: "success"
                });
                return response.data;
            } catch (error) {
                console.error("Error al publicar la imagen:", error);
                avisos.mostrarAviso({
                    mensaje: "No se pudo publicar la imagen",
                    tipo: "error"
                });
                throw error;
            }
        },

        async despublicarImagen(id) {
            if (!id) {
                console.error("No se ha proporcionado un ID válido.");
                throw new Error("No se ha proporcionado un ID válido.");
            }

            const avisos = useAvisosStore(); // ✅ Instancia local del store de avisos

            try {
                const response = await axios.patch(
                    `http://localhost:3000/imagenes/${id}`,
                    { publicada: false }
                );
                avisos.mostrarAviso({
                    mensaje: "Imagen despublicada exitosamente",
                    tipo: "success"
                });
                return response.data;
            } catch (error) {
                console.error("Error al publicar la imagen:", error);
                avisos.mostrarAviso({
                    mensaje: "No se pudo despublicar la imagen",
                    tipo: "error"
                });
                throw error;
            }
        },

        async getAPIImagenGeneradaById(id) {
            if (!id) {
                console.error("No se ha proporcionado un ID válido.");
                throw new Error("No se ha proporcionado un ID válido.");
            }
            try {
                const response = await axios.get(API_URL + "api/Dibujos/" + id);
                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener la imagen generada.";
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

        async getImagenGeneradaByID(id) {
            if (!id) {
                console.error("No se ha proporcionado un ID válido.");
                throw new Error("No se ha proporcionado un ID válido.");
            }
            try {
                const response = await axios.get("http://localhost:3000/imagenes?id=" + id);
                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener la imagen generada.";
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

        async getImagenesByUser() {
            try {
                const response = await axios.get("http://localhost:3000/imagenes?id_usuario=" + this.usuario.id);
                return response.data;
            } catch (error) {
                let errorMessage = "Error desconocido al obtener las imagenes del usuario.";
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

        async getPublicaciones() {
            try {
                const response = await axios.get("http://localhost:3000/imagenes?publicada=true");
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

            const avisos = useAvisosStore(); // ✅ Instancia local del store de avisos

            try {
                await axios.delete(`http://localhost:3000/imagenes/${id}`);
                avisos.mostrarAviso({
                    mensaje: "Imagen eliminada exitosamente",
                    tipo: "success"
                });
            } catch (error) {
                console.error("Error al eliminar la imagen:", error);
                avisos.mostrarAviso({
                    mensaje: "No se pudo eliminar la imagen",
                    tipo: "error"
                });
                throw error;
            }
        },


        async fetchUsuarios() {
            try {
                const response = await axios.get("http://localhost:3000/usuarios");
                this.usuarios = response.data;
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        },

        async crearUsuario(nuevoUsuario) {
            try {
                const response = await axios.post(
                    "http://localhost:3000/usuarios",
                    nuevoUsuario
                );
                this.usuarios.push(response.data);
                this.setUsuario(response.data);
            } catch (error) {
                console.error("Error al crear el usuario:", error);
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

        async eliminarUsuario(id) {
            const avisos = useAvisosStore(); // ✅ Instancia local del store de avisos
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`);
                this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
                avisos.mostrarAviso({
                    mensaje: "Usuario eliminado correctamente",
                    tipo: "success"
                });
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        },

        async iniciarSesion(correo, password) {
            try {
                const response = await axios.get(
                    "http://localhost:3000/usuarios?correo=" + correo
                );
                const usuario = response.data.find((u) => u.password === password);

                if (usuario) {
                    this.setUsuario(usuario);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
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

        async getNivelesAcceso() {
            try {
                const response = await fetch('http://localhost:3000/niveles_acceso');
                const data = await response.json();
                this.nivelesAcceso = data;
            } catch (error) {
                console.error('Error al obtener niveles de acceso:', error);
            }
        },

        async comprobarSiPuedeGenerarImagen() {
            const avisos = useAvisosStore(); // ✅ Instancia local del store de avisos
            await this.getNivelesAcceso();
            if (!this.usuario) {
                avisos.mostrarAviso({
                    mensaje: "No has iniciado session",
                    tipo: "error"
                });
                return false;
            }

            const nivel = this.nivelesAcceso.find(
                (n) => String(n.id) === String(this.usuario.nivelAcceso)
            );

            if (!nivel) {
                avisos.mostrarAviso({
                    mensaje: "Tu nivel de acceso no esta definido",
                    tipo: "error"
                });
                return false;
            }

            const limite = parseInt(nivel.cantidad, 10);

            if (limite >= 2000) return true; // acceso ilimitado

            const generadasHoy = await this.getImagenesGeneradasHoy(this.usuario.id);

            if (generadasHoy >= limite) {
                avisos.mostrarAviso({
                    mensaje: "Has alcanzado el límite diario de ${limite} imágenes.",
                    tipo: "info"
                });
                return false;
            }

            return true;
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

    },
});
