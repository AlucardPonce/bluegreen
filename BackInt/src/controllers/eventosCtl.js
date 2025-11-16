// Inicialización explícita de Firebase Admin
import admin from 'firebase-admin';

if (!admin.apps.length) {
  let credential;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      );
      credential = admin.credential.cert(serviceAccount);
    } else {
      // Usa Application Default Credentials (requiere GOOGLE_APPLICATION_CREDENTIALS apuntando al JSON)
      credential = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
    });
  } catch (e) {
    console.error('Error inicializando Firebase Admin:', e);
  }
}

// Crear evento
export const crearEvento = async (req, res, next) => {
  try {
    const { nombre, fecha } = req.body;
    if (!nombre || !fecha) {
      return res.status(400).json({ message: 'nombre y fecha son obligatorios' });
    }
    const Evento = await import('../models/eventoModel.js');
    const nuevo = await Evento.createEvento(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};

// Listar eventos
export const obtenerEventos = async (_req, res, next) => {
  try {
    const Evento = await import('../models/eventoModel.js');
    const lista = await Evento.getEventos();
    res.json(lista);
  } catch (err) {
    next(err);
  }
};

// Obtener por id
export const obtenerEventoPorId = async (req, res, next) => {
  try {
    const Evento = await import('../models/eventoModel.js');
    const ev = await Evento.getEventoById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(ev);
  } catch (err) {
    next(err);
  }
};

// Actualizar (merge)
export const actualizarEvento = async (req, res, next) => {
  try {
    const Evento = await import('../models/eventoModel.js');
    const existe = await Evento.getEventoById(req.params.id);
    if (!existe) return res.status(404).json({ message: 'Evento no encontrado' });
    const actualizado = await Evento.updateEvento(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};

// Eliminar
export const eliminarEvento = async (req, res, next) => {
  try {
    const Evento = await import('../models/eventoModel.js');
    const existe = await Evento.getEventoById(req.params.id);
    if (!existe) return res.status(404).json({ message: 'Evento no encontrado' });
    await Evento.deleteEvento(req.params.id);
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    next(err);
  }
};

// Cambiar estado
export const cambiarEstadoEvento = async (req, res, next) => {
  try {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ message: 'estado es obligatorio' });
    const Evento = await import('../models/eventoModel.js');
    const existe = await Evento.getEventoById(req.params.id);
    if (!existe) return res.status(404).json({ message: 'Evento no encontrado' });
    const actualizado = await Evento.changeEstado(req.params.id, estado);
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};
