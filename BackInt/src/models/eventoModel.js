import { db } from '../lib/firebaseAdmin.js';

const COLLECTION = 'eventos';

export const createEvento = async (data) => {
  const now = new Date().toISOString();
  const evento = {
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    fecha: data.fecha,        // ISO string o 'YYYY-MM-DD'
    hora: data.hora || '',
    ubicacion: data.ubicacion || '',
    categoria: data.categoria || '',
    precio: data.precio ?? 0,
    imagen: data.imagen || '',
    fotos: Array.isArray(data.fotos) ? data.fotos : [],
    estado: data.estado || 'activo',
    asistentes: data.asistentes ?? 0,
    destacado: !!data.destacado,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await db.collection(COLLECTION).add(evento);
  return { id: ref.id, ...evento };
};

export const getEventos = async () => {
  const snap = await db.collection(COLLECTION).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getEventoById = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateEvento = async (id, data) => {
  const patch = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).doc(id).set(patch, { merge: true });
  return getEventoById(id);
};

export const deleteEvento = async (id) => {
  await db.collection(COLLECTION).doc(id).delete();
  return { id };
};

export const changeEstado = async (id, estado) => {
  await db.collection(COLLECTION).doc(id).set(
    { estado, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  return getEventoById(id);
};
