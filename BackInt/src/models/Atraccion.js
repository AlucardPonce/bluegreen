import { db } from '../config/firebase.js';

class Atraccion {
    constructor(data) {
        this.nombre = data.nombre;
        this.categoria = data.categoria;
        this.descripcion = data.descripcion;
        this.latitud = data.latitud;
        this.longitud = data.longitud;
        this.videoUrl = data.videoUrl || '';
        this.informacionCultural = data.informacionCultural;
        this.horarios = data.horarios;
        this.costoEntrada = data.costoEntrada;
        this.restricciones = data.restricciones;
        this.nivelDificultad = data.nivelDificultad;
        this.servicios = data.servicios;
        this.fotos = data.fotos || [];
        this.audioUrl = data.audioUrl || '';
        this.estado = data.estado || 'activa'; // 'activa' o 'inactiva'
        this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
        this.fechaActualizacion = data.fechaActualizacion || new Date().toISOString();
    }

    // Crear una nueva atracción
    static async create(atraccionData) {
        try {
            console.log('=== CREANDO ATRACCIÓN EN FIRESTORE ===');
            console.log('Datos recibidos:', {
                nombre: atraccionData.nombre,
                cantidadFotos: atraccionData.fotos?.length || 0,
                tieneAudio: !!atraccionData.audioUrl
            });

            const newAtraccion = {
                ...atraccionData,
                fotos: atraccionData.fotos || [], // Asegurar que sea un array
                audioUrl: atraccionData.audioUrl || '',
                fechaCreacion: new Date(),
                fechaActualizacion: new Date()
            };

            console.log('Atracción preparada para guardar:', {
                ...newAtraccion,
                fotos: `Array con ${newAtraccion.fotos.length} elementos`,
                audioUrl: newAtraccion.audioUrl ? 'Presente' : 'Ausente'
            });

            const docRef = await db.collection('atracciones').add(newAtraccion);
            console.log('Atracción guardada con ID:', docRef.id);

            const snapshot = await docRef.get();
            const savedData = { id: docRef.id, ...snapshot.data() };
            
            console.log('Datos guardados verificados:', {
                id: savedData.id,
                cantidadFotos: savedData.fotos?.length || 0
            });

            return savedData;
        } catch (error) {
            console.error('Error en create:', error);
            throw new Error('Error al crear la atracción: ' + error.message);
        }
    }

    // Obtener todas las atracciones
    static async getAll(filtros = {}) {
        try {
            // Obtener TODAS las atracciones sin filtros en Firestore
            const atraccionesSnapshot = await db.collection('atracciones').get();
            
            if (atraccionesSnapshot.empty) {
                return [];
            }

            // Convertir a array
            let atracciones = atraccionesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Aplicar filtros en memoria (NO en Firestore)
            if (filtros.estado) {
                atracciones = atracciones.filter(a => a.estado === filtros.estado);
            }

            if (filtros.categoria) {
                atracciones = atracciones.filter(a => a.categoria === filtros.categoria);
            }

            if (filtros.nivelDificultad) {
                atracciones = atracciones.filter(a => a.nivelDificultad === filtros.nivelDificultad);
            }

            // Ordenar por fecha de creación (en memoria)
            atracciones.sort((a, b) => {
                const fechaA = a.fechaCreacion?.toDate?.() || new Date(a.fechaCreacion);
                const fechaB = b.fechaCreacion?.toDate?.() || new Date(b.fechaCreacion);
                return fechaB - fechaA;
            });

            return atracciones;
        } catch (error) {
            console.error('Error en getAll:', error);
            throw new Error('Error al obtener atracciones: ' + error.message);
        }
    }

    // Obtener una atracción por ID
    static async getById(id) {
        try {
            const doc = await db.collection('atracciones').doc(id).get();
            
            if (!doc.exists) {
                throw new Error('Atracción no encontrada');
            }

            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            throw new Error(`Error al obtener atracción: ${error.message}`);
        }
    }

    // Actualizar una atracción
    static async update(id, updateData) {
        try {
            const docRef = db.collection('atracciones').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Atracción no encontrada');
            }

            const updatedData = {
                ...updateData,
                fechaActualizacion: new Date().toISOString()
            };

            await docRef.update(updatedData);

            return {
                id,
                ...doc.data(),
                ...updatedData
            };
        } catch (error) {
            throw new Error(`Error al actualizar atracción: ${error.message}`);
        }
    }

    // Eliminar una atracción
    static async delete(id) {
        try {
            const docRef = db.collection('atracciones').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Atracción no encontrada');
            }

            await docRef.delete();
            return { message: 'Atracción eliminada correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar atracción: ${error.message}`);
        }
    }

    // Cambiar estado de la atracción
    static async cambiarEstado(id, nuevoEstado) {
        try {
            const docRef = db.collection('atracciones').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('Atracción no encontrada');
            }

            await docRef.update({
                estado: nuevoEstado,
                fechaActualizacion: new Date().toISOString()
            });

            return {
                id,
                ...doc.data(),
                estado: nuevoEstado
            };
        } catch (error) {
            throw new Error(`Error al cambiar estado: ${error.message}`);
        }
    }

    // Buscar atracciones por nombre o descripción
    static async search(termino) {
        try {
            const snapshot = await db.collection('atracciones').get();
            
            const atracciones = [];
            const terminoLower = termino.toLowerCase();

            snapshot.forEach(doc => {
                const data = doc.data();
                if (
                    data.nombre.toLowerCase().includes(terminoLower) ||
                    data.descripcion.toLowerCase().includes(terminoLower)
                ) {
                    atracciones.push({
                        id: doc.id,
                        ...data
                    });
                }
            });

            return atracciones;
        } catch (error) {
            throw new Error(`Error al buscar atracciones: ${error.message}`);
        }
    }

    // Obtener estadísticas
    static async getEstadisticas() {
        try {
            const snapshot = await db.collection('atracciones').get();
            
            const stats = {
                total: snapshot.size,
                activas: 0,
                inactivas: 0,
                porCategoria: {},
                porNivelDificultad: {}
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                
                // Contar por estado
                if (data.estado === 'activa') stats.activas++;
                else stats.inactivas++;

                // Contar por categoría
                stats.porCategoria[data.categoria] = (stats.porCategoria[data.categoria] || 0) + 1;

                // Contar por nivel de dificultad
                stats.porNivelDificultad[data.nivelDificultad] = (stats.porNivelDificultad[data.nivelDificultad] || 0) + 1;
            });

            return stats;
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

export default Atraccion;
