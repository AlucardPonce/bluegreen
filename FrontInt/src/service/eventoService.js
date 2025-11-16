import api from './api';

// Servicio para manejar los eventos turísticos

// Crear un nuevo evento
export const crearEvento = async (eventoData) => {
    try {
        const response = await api.post('/eventos', eventoData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear el evento' };
    }
};

// Obtener todos los eventos
export const obtenerEventos = async () => {
    try {
        const response = await api.get('/eventos');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los eventos' };
    }
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (id) => {
    try {
        const response = await api.get(`/eventos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener el evento' };
    }
};

// Actualizar un evento
export const actualizarEvento = async (id, eventoData) => {
    try {
        const response = await api.put(`/eventos/${id}`, eventoData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el evento' };
    }
};

// Eliminar un evento
export const eliminarEvento = async (id) => {
    try {
        const response = await api.delete(`/eventos/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al eliminar el evento' };
    }
};

// Cambiar estado de un evento
export const cambiarEstadoEvento = async (id, estado) => {
    try {
        const response = await api.patch(`/eventos/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al cambiar el estado del evento' };
    }
};

export default {
    crearEvento,
    obtenerEventos,
    obtenerEventoPorId,
    actualizarEvento,
    eliminarEvento,
    cambiarEstadoEvento
};