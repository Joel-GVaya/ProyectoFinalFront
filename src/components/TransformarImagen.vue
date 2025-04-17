<template>
    <div class="transformar-imagen">
        <!-- Barra lateral -->
        <aside class="sidebar">
            <h2>Estilos</h2>
            <ul>
                <li 
                    v-for="estilo in estilos" 
                    :key="estilo.id" 
                    :class="{ selected: estiloSeleccionado === estilo.id }"
                    @click="seleccionarEstilo(estilo.id)"
                >
                    <img :src="estilo.imagen" alt="Estilo" class="style-image" />
                    <p >{{ estilo.nombre }}</p>
                </li>
            </ul>
        </aside>

        <!-- Área principal -->
        <main class="main-content">
            <div 
                class="drop-area" 
                @dragover.prevent 
                @drop.prevent="manejarArrastre"
            >
                <p v-if="!imagen">Arrastra tu imagen aquí</p>
                <img v-if="imagen" :src="imagen" alt="Previsualización" />
            </div>
            <button class="upload-button" @click="subirImagen">Seleccionar Imagen</button>
            <input type="file" ref="fileInput" accept="image/*" @change="manejarArchivo" hidden />
            <button class="convert-button" :disabled="!imagen" @click="convertirImagen">Convertir Imagen</button>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/store.js'; // Importa el store

// Obtén la instancia del store
const store = useUserStore();

// Importar las imágenes directamente
import lineArtImage from '@/assets/Estilos/LineArt.jpg';

const estilos = ref([
    { id: 1, nombre: 'LineArt', imagen: lineArtImage },
    { id: 2, nombre: 'Pixar', imagen: lineArtImage },
    { id: 3, nombre: 'Anime', imagen: lineArtImage }
]);

const estiloSeleccionado = ref(null);
const imagen = ref(null);
const fileInput = ref(null); // Referencia al elemento DOM <input>
const archivoSeleccionado = ref(null); // Almacena el archivo seleccionado

const seleccionarEstilo = (id) => {
    estiloSeleccionado.value = id;
};

const manejarArrastre = (event) => {
    const archivo = event.dataTransfer.files[0];
    if (archivo && archivo.type.startsWith('image/')) {
        imagen.value = URL.createObjectURL(archivo); // Crear una URL para la previsualización
        archivoSeleccionado.value = archivo; // Guardar el archivo original para subirlo
    }
};

const manejarArchivo = (event) => {
    const archivo = event.target.files[0];
    if (archivo && archivo.type.startsWith('image/')) {
        imagen.value = URL.createObjectURL(archivo); // Crear una URL para la previsualización
        archivoSeleccionado.value = archivo; // Guardar el archivo original para subirlo
    }
};

const subirImagen = () => {
    fileInput.value.click(); // Abrir el selector de archivos
};

const convertirImagen = async () => {
    if (!estiloSeleccionado.value) {
        alert('Por favor selecciona un estilo antes de convertir la imagen.');
        return;
    }
    if (!archivoSeleccionado.value) {
        alert('Por favor selecciona o arrastra una imagen antes de convertirla.');
        return;
    }

    try {
        // Llamar al método del store para subir el archivo original
        const respuesta = await store.generarLineArt(archivoSeleccionado.value);

        // Mostrar un mensaje de éxito
        alert(`Imagen subida exitosamente. Nombre del archivo procesado: ${respuesta.nombreArchivo}`);
    } catch (error) {
        console.error('Error al convertir la imagen:', error);
        alert(`Error al convertir la imagen: ${error.message}`);
    }
};
</script>

<style scoped>
/* Contenedor principal */
.transformar-imagen {
    display: flex;
    height: 85vh;
    background-color: #f3f3f3;
}

/* Barra lateral */
.sidebar {
    margin: 5px;
    width: 20%;
    background-color: #d1c4e9; /* Morado claro */
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* Permite scroll si hay muchos estilos */
    border: 4px solid #6a1b9a; /* Borde morado */
    border-radius: 12px; /* Bordes redondeados */
}

.sidebar h2 {
    color: #6a1b9a; /* Morado */
    margin-bottom: 1rem;
    font-size: 1.5rem;
    text-align: center;
}


.sidebar ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Dos columnas */
    gap: 1rem; /* Espaciado entre elementos */
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar li {
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sidebar li:hover {
    background-color: #a5d6a7; /* Verde claro */
}

.sidebar li.selected {
    background-color: #6a1b9a; /* Morado */
    color: white;
}

.style-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.sidebar p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: bold;
    color: #424242;
}

/* Área principal */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.drop-area {
    width: 80%;
    height: 300px;
    border: 2px dashed #6a1b9a; /* Morado */
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    margin-bottom: 1rem;
    text-align: center;
    color: #6a1b9a;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
}

.drop-area:hover {
    background-color: #f3e5f5; /* Morado claro */
}

.drop-area img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
}

.upload-button, .convert-button {
    background-color: #a5d6a7; /* Verde claro */
    color: #424242;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.upload-button:hover, .convert-button:hover {
    background-color: #81c784; /* Verde más oscuro */
    transform: scale(1.05);
}

.convert-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>