import { Router } from 'express';
import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  cambiarEstadoEvento,
} from '../controllers/eventosCtl.js';

const router = Router();

// /api/eventos
router.get('/', obtenerEventos);
router.post('/', crearEvento);

// /api/eventos/:id
router.get('/:id', obtenerEventoPorId);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

// /api/eventos/:id/estado
router.patch('/:id/estado', cambiarEstadoEvento);

export default router;
