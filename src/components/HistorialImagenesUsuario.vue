<template>
    <div class="historial-imagenes">
        <br>
        <br>
        <br>
        <h1>Historial de imágenes</h1>
        <p>Aquí podrás ver todas las imágenes generadas.</p>

        <!-- Filtros -->
        <div class="filtros">
            <label>
                Estilo:
                <select v-model="filtroEstilo">
                    <option value="">Todos</option>
                    <option v-for="estilo in estilosDisponibles" :key="estilo.id" :value="estilo.id">
                        {{ estilo.nombre }}
                    </option>
                </select>
            </label>

            <label>
                Fecha desde:
                <input type="date" v-model="filtroFechaDesde" />
            </label>

            <label>
                Fecha hasta:
                <input type="date" v-model="filtroFechaHasta" />
            </label>

            <label>
                Mostrar:
                <select v-model.number="itemsPorPagina" @change="paginaActual = 1">
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="30">30</option>
                </select>
                imágenes por página
            </label>
        </div>

        <!-- Tabla -->
        <table class="tabla-imagenes">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Fecha</th>
                    <th>Estilo</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="imagen in imagenesPaginadas" :key="imagen.Id">
                    <td>
                        <img :src="`data:image/png;base64,${imagen.ImagenBase64}`" alt="Imagen generada"
                            class="preview" />
                    </td>
                    <td>{{ formatearFecha(imagen.Fecha) }}</td>
                    <td>{{ getNombreEstilo(imagen.Estilo) }}</td>
                    <td>
                        <div class="opciones-botonera">
                            <button @click="togglePublicacion(imagen)"
                                :title="imagen.Publicada ? 'Despublicar imagen' : 'Publicar imagen'"
                                :class="{ 'btn-publicar': !imagen.Publicada, 'btn-despublicar': imagen.Publicada }">
                                {{ imagen.Publicada ? "📤" : "📥" }}
                            </button>
                            <button @click="eliminar(imagen.Id)" title="Eliminar imagen" class="btn-eliminar">
                                🗑️
                            </button>
                            <button @click="descargar(imagen.ImagenBase64)" title="Descargar imagen"
                                class="btn-descargar">
                                ⬇️
                            </button>
                            <button @click="ver(imagen.Id)" title="Ver imagen" class="btn-ver">🔍</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <!-- Paginación -->
        <div class="paginacion" v-if="totalPaginas > 1" style="margin-top: 1rem;">
            <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
            <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
            <button @click="paginaActual++" :disabled="paginaActual === totalPaginas">Siguiente</button>
        </div>
        <br>
        <br>
        <br>
    </div>
</template>

<script>
import { useUserStore } from "@/store/store";
import { mapState } from "pinia";

export default {
    name: "HistorialImagenes",
    data() {
        return {
            imagenes: [],
            filtroEstilo: "",
            filtroFechaDesde: "",
            filtroFechaHasta: "",
            estilosDisponibles: [],
            userStore: null,
            itemsPorPagina: 10,
            paginaActual: 1,
        };
    },

    async mounted() {
        this.userStore = useUserStore();
        try {
            const imagenesData = await this.userStore.getImagenesByUser();
            this.imagenes = imagenesData;

            const estilosUsados = new Set(imagenesData.map((img) => img.Estilo));
            this.estilosDisponibles = this.estilos.filter((estilo) => estilosUsados.has(estilo.id));
        } catch (error) {
            console.error("Error al obtener imágenes:", error);
        }
    },

    computed: {
        ...mapState(useUserStore, ["estilos"]),

        imagenesFiltradas() {
            return this.imagenes.filter((imagen) => {
                const fechaImagen = new Date(imagen.Fecha);
                const desde = this.filtroFechaDesde ? new Date(this.filtroFechaDesde) : null;
                const hasta = this.filtroFechaHasta ? new Date(this.filtroFechaHasta) : null;

                const pasaEstilo = this.filtroEstilo ? imagen.Estilo == this.filtroEstilo : true;
                const pasaDesde = desde ? fechaImagen >= desde : true;
                const pasaHasta = hasta ? fechaImagen <= hasta : true;

                return pasaEstilo && pasaDesde && pasaHasta;
            });
        },

        totalPaginas() {
            return Math.ceil(this.imagenesFiltradas.length / this.itemsPorPagina);
        },

        imagenesPaginadas() {
            const start = (this.paginaActual - 1) * this.itemsPorPagina;
            return this.imagenesFiltradas.slice(start, start + this.itemsPorPagina);
        },
    },

    watch: {
        imagenes: {
            handler(nuevasImagenes) {
                const estilosUsados = new Set(nuevasImagenes.map((img) => img.Estilo));
                this.estilosDisponibles = this.estilos.filter((estilo) => estilosUsados.has(estilo.id));
                if (this.filtroEstilo && !estilosUsados.has(this.filtroEstilo)) {
                    this.filtroEstilo = "";
                }
            },
            immediate: true,
        },
        imagenesFiltradas() {
            if (this.paginaActual > this.totalPaginas) {
                this.paginaActual = this.totalPaginas || 1;
            }
        },
    },

    methods: {
        formatearFecha(fechaISO) {
            const fecha = new Date(fechaISO);
            return fecha.toLocaleDateString();
        },
        getNombreEstilo(idEstilo) {
            const estilo = this.estilos.find((e) => e.id === idEstilo);
            return estilo ? estilo.nombre : "Desconocido";
        },
        eliminar(id) {
            this.userStore
                .eliminarImagen(id)
                .then(() => {
                    this.imagenes = this.imagenes.filter((img) => img.Id !== id);
                })
                .catch((error) => {
                    console.error("Error al eliminar la imagen:", error);
                });
        },
        async togglePublicacion(imagen) {
            try {
                const exito = await this.userStore.publicarImagen(imagen.Id);
                if (exito === true) {
                    imagen.Publicada = !imagen.Publicada;
                    this.imagenes = [...this.imagenes];
                }
            } catch (error) {
                console.error("Error al cambiar el estado de publicación:", error);
            }
        },
        descargar(base64) {
            if (!base64) return;
            const enlace = document.createElement("a");
            enlace.href = `data:image/png;base64,${base64}`;
            enlace.download = "imagen.png";
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
        },
        ver(id) {
            this.$router.push({ name: "MostrarImagen", params: { id } });
        },
    },

};
</script>

<style scoped>
.historial-imagenes {
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #284870;
}

.historial-imagenes h1{
    color: white;
}

.historial-imagenes p{
    color: white;
}

.filtros {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.filtros label {
    font-weight: 600;
    color: white;
}

.filtros select,
.filtros input[type="date"] {
    margin-left: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
}

.tabla-imagenes {
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0;
    width: 95%;
    max-width: 1000px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    border: 5px solid #aa33b1;
    overflow: hidden;
}

th {
    background-color: #602f60;
    color: white;
    padding: 1rem;
    font-size: 1rem;
    border-bottom: 2px solid #4a148c;
}

td {
    background-color: #67497e;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
    color: white;
}

tr:last-child td {
    border-bottom: none;
}

.preview {
    width: 150px;
    height: auto;
    border: 2px solid #6a1b9a;
    border-radius: 8px;
    transition: transform 0.2s ease;
}

.preview:hover {
    transform: scale(1.05);
}

.opciones-botonera {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.opciones-botonera button {
    background-color: #aa33b1;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.opciones-botonera button:hover {
    transform: scale(1.1);
}

.btn-publicar {
    background-color: #4caf50;
    /* verde */
}

.btn-publicar:hover {
    background-color: #388e3c;
}

.btn-despublicar {
    background-color: #ff9800;
    /* naranja */
}

.btn-despublicar:hover {
    background-color: #f57c00;
}

.btn-eliminar {
    background-color: #e53935;
    /* rojo */
}

.btn-eliminar:hover {
    background-color: #b71c1c;
}

.btn-descargar {
    background-color: #1976d2;
    /* azul */
}

.btn-descargar:hover {
    background-color: #0d47a1;
}

.btn-ver {
    background-color: #9c27b0;
    /* púrpura */
}

.btn-ver:hover {
    background-color: #6a1b9a;
}

button {
    margin: 0.2rem;
    padding: 0.5rem 0.8rem;
    background-color: #6a1b9a;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #4a148c;
}

.paginacion button {
    margin: 0 0.5rem;
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #6a1b9a;
    background-color: white;
    color: #6a1b9a;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.paginacion span {
    color: white;
}

.paginacion button:disabled {
    cursor: default;
    opacity: 0.5;
}

.paginacion button:hover:not(:disabled) {
    background-color: #6a1b9a;
    color: white;
}
</style>
