import express from 'express';
import {
    crearAtraccion,
    obtenerAtracciones,
    obtenerAtraccionPorId,
    actualizarAtraccion,
    eliminarAtraccion,
    cambiarEstadoAtraccion,
    buscarAtracciones,
    obtenerEstadisticas
} from '../controllers/atraccionCtl.js';

const router = express.Router();

// Rutas de atracciones turísticas

// GET /api/atracciones/estadisticas - Obtener estadísticas
router.get('/estadisticas', obtenerEstadisticas);

// GET /api/atracciones/buscar?q=termino - Buscar atracciones
router.get('/buscar', buscarAtracciones);

// GET /api/atracciones - Obtener todas las atracciones (con filtros opcionales)
router.get('/', obtenerAtracciones);

// GET /api/atracciones/:id - Obtener una atracción por ID
router.get('/:id', obtenerAtraccionPorId);

// POST /api/atracciones - Crear una nueva atracción
router.post('/', crearAtraccion);

// PUT /api/atracciones/:id - Actualizar una atracción
router.put('/:id', actualizarAtraccion);

// PATCH /api/atracciones/:id/estado - Cambiar estado de la atracción
router.patch('/:id/estado', cambiarEstadoAtraccion);

// DELETE /api/atracciones/:id - Eliminar una atracción
router.delete('/:id', eliminarAtraccion);

export default router;
