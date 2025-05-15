import { defineStore } from "pinia";
import axios from "axios";
import { useAvisosStore } from "@/store/avisos";

const API_URL = "https://localhost:44377/";

export const useUserStore = defineStore("user", {
    state: () => ({
        usuarios: [],
        imagenesConvertidas: [],
        estilos: [],
        usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    }),

    getters: {
        // Puedes poner aquí getters si quieres
    },

    actions: {
        async populateEstilos() {
            try {
                const response = await axios.get("http://localhost:3000/estilosDisponibles");
                this.estilos = response.data;
            } catch (error) {
                console.log("Error al obtener los estilos disponibles" + error);
            }
        },

        async generarLineArt(imageFile) {
            if (!imageFile || !(imageFile instanceof File)) {
                console.error("No se ha proporcionado una imagen válida.");
                throw new Error("No se ha proporcionado una imagen válida.");
            }

            const formData = new FormData();
            formData.append("image", imageFile, imageFile.name);

            try {
                const response = await axios.post(API_URL + "api/Dibujos/subir/imagen", formData);
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
                const response = await axios.post("http://localhost:3000/usuarios", nuevoUsuario);
                this.usuarios.push(response.data);
                this.setUsuario(response.data);
            } catch (error) {
                console.error("Error al crear el usuario:", error);
            }
        },

        async editarUsuario(id, datosActualizados) {
            try {
                await axios.put(`http://localhost:3000/usuarios/${id}`, datosActualizados);
                this.setUsuario(datosActualizados);
                console.log("Datos actualizados:", datosActualizados);
            } catch (error) {
                console.error("Error al editar el usuario:", error);
            }
        },

        async eliminarUsuario(id) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`);
                this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
                alert("Usuario eliminado exitosamente");
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            }
        },

        async iniciarSesion(correo, password) {
            try {
                const response = await axios.get("http://localhost:3000/usuarios?correo=" + correo);
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
    },
});
