import api from './api';

// Servicio para manejar las atracciones turísticas

// Crear una nueva atracción
export const crearAtraccion = async (atraccionData) => {
    try {
        const response = await api.post('/atracciones', atraccionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear la atracción' };
    }
};

// Obtener todas las atracciones SIN filtros en el servidor
export const obtenerAtracciones = async () => {
    try {
        const response = await api.get('/atracciones');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las atracciones' };
    }
};

// Obtener atracciones con filtros aplicados en el CLIENTE
export const obtenerAtraccionesFiltradas = (atracciones, filtros = {}) => {
    let resultado = [...atracciones];
    
    if (filtros.estado) {
        resultado = resultado.filter(a => a.estado === filtros.estado);
    }
    
    if (filtros.categoria) {
        resultado = resultado.filter(a => a.categoria === filtros.categoria);
    }
    
    if (filtros.nivelDificultad) {
        resultado = resultado.filter(a => a.nivelDificultad === filtros.nivelDificultad);
    }
    
    return resultado;
};

// Obtener una atracción por ID
export const obtenerAtraccionPorId = async (id) => {
    try {
        const response = await api.get(`/atracciones/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener la atracción' };
    }
};

// Actualizar una atracción
export const actualizarAtraccion = async (id, atraccionData) => {
    try {
        const response = await api.put(`/atracciones/${id}`, atraccionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar la atracción' };
    }
};

// Eliminar una atracción
export const eliminarAtraccion = async (id) => {
    try {
        const response = await api.delete(`/atracciones/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar la atracción' };
    }
};

// Cambiar estado de una atracción (activa/inactiva)
export const cambiarEstadoAtraccion = async (id, estado) => {
    try {
        const response = await api.patch(`/atracciones/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al cambiar el estado de la atracción' };
    }
};

// Buscar atracciones
export const buscarAtracciones = async (termino) => {
    try {
        const response = await api.get(`/atracciones/buscar?q=${encodeURIComponent(termino)}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al buscar atracciones' };
    }
};

// Obtener estadísticas de atracciones
export const obtenerEstadisticas = async () => {
    try {
        const response = await api.get('/atracciones/estadisticas');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
};

// Subir imagen
export const subirImagen = async (file) => {
    try {
        const formData = new FormData();
        formData.append('imagen', file);
        
        const response = await api.post('/atracciones/upload-imagen', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al subir la imagen' };
    }
};

// Subir audio
export const subirAudio = async (file) => {
    try {
        const formData = new FormData();
        formData.append('audio', file);
        
        const response = await api.post('/atracciones/upload-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al subir el audio' };
    }
};

export default {
    crearAtraccion,
    obtenerAtracciones,
    obtenerAtraccionesFiltradas,
    obtenerAtraccionPorId,
    actualizarAtraccion,
    eliminarAtraccion,
    cambiarEstadoAtraccion,
    buscarAtracciones,
    obtenerEstadisticas,
    subirImagen,
    subirAudio
};
