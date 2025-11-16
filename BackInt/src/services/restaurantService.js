import { db } from '../config/firebase.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { RestaurantModel } from '../models/Restaurant.js';

const COLLECTION_NAME = 'restaurants';

/**
 * Obtener todos los restaurantes activos
 */
export const getAllRestaurants = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const restaurants = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filtrar restaurantes no eliminados
            if (!data.deletedAt) {
                restaurants.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        // Ordenar por fecha de creación (más recientes primero)
        restaurants.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        return restaurants;
    } catch (error) {
        console.error('Error getting restaurants:', error);
        throw error;
    }
};

/**
 * Obtener un restaurante por ID
 */
export const getRestaurantById = async (restaurantId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, restaurantId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Restaurante no encontrado');
        }

        const restaurantData = docSnap.data();

        if (restaurantData.deletedAt) {
            throw new Error('Restaurante no encontrado');
        }

        return {
            id: docSnap.id,
            ...restaurantData
        };
    } catch (error) {
        console.error('Error getting restaurant:', error);
        throw error;
    }
};

/**
 * Crear un nuevo restaurante
 */
export const createRestaurant = async (restaurantData) => {
    try {
        // Validar campos requeridos
        const missingFields = RestaurantModel.requiredFields.filter(
            field => !restaurantData[field]
        );

        if (missingFields.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }

        // Validar formato de datos
        if (!RestaurantModel.validations.latitude(restaurantData.latitude)) {
            throw new Error('Latitud inválida');
        }

        if (!RestaurantModel.validations.longitude(restaurantData.longitude)) {
            throw new Error('Longitud inválida');
        }

        const newRestaurant = {
            ...RestaurantModel.structure,
            ...restaurantData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), newRestaurant);

        return {
            id: docRef.id,
            ...newRestaurant
        };
    } catch (error) {
        console.error('Error creating restaurant:', error);
        throw error;
    }
};

/**
 * Actualizar un restaurante
 */
export const updateRestaurant = async (restaurantId, updateData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, restaurantId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Restaurante no encontrado');
        }

        // Solo permitir actualizar campos permitidos
        const allowedUpdates = {};
        RestaurantModel.updatableFields.forEach(field => {
            if (updateData[field] !== undefined) {
                allowedUpdates[field] = updateData[field];
            }
        });

        allowedUpdates.updatedAt = Timestamp.now();

        await updateDoc(docRef, allowedUpdates);

        const updatedDoc = await getDoc(docRef);
        return {
            id: updatedDoc.id,
            ...updatedDoc.data()
        };
    } catch (error) {
        console.error('Error updating restaurant:', error);
        throw error;
    }
};

/**
 * Eliminar un restaurante (soft delete)
 */
export const deleteRestaurant = async (restaurantId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, restaurantId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Restaurante no encontrado');
        }

        await updateDoc(docRef, {
            deletedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            isActive: false
        });

        return { message: 'Restaurante eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        throw error;
    }
};

export default {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
