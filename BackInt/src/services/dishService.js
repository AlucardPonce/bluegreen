import { db } from '../config/firebase.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import { DishModel } from '../models/Dish.js';

const COLLECTION_NAME = 'dishes';

/**
 * Obtener todos los platillos activos
 */
export const getAllDishes = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const dishes = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filtrar platillos no eliminados
            if (!data.deletedAt) {
                dishes.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        // Ordenar por fecha de creación (más recientes primero)
        dishes.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        return dishes;
    } catch (error) {
        console.error('Error getting dishes:', error);
        throw error;
    }
};

/**
 * Obtener platillos por restaurante
 */
export const getDishesByRestaurant = async (restaurantId) => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const dishes = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filtrar por restaurante y no eliminados
            if (!data.deletedAt && data.restaurantId === restaurantId) {
                dishes.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        // Ordenar por fecha de creación
        dishes.sort((a, b) => {
            const timeA = a.createdAt?.toMillis() || 0;
            const timeB = b.createdAt?.toMillis() || 0;
            return timeB - timeA;
        });

        return dishes;
    } catch (error) {
        console.error('Error getting dishes by restaurant:', error);
        throw error;
    }
};

/**
 * Obtener un platillo por ID
 */
export const getDishById = async (dishId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dishId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Platillo no encontrado');
        }

        const dishData = docSnap.data();

        if (dishData.deletedAt) {
            throw new Error('Platillo no encontrado');
        }

        return {
            id: docSnap.id,
            ...dishData
        };
    } catch (error) {
        console.error('Error getting dish:', error);
        throw error;
    }
};

/**
 * Crear un nuevo platillo
 */
export const createDish = async (dishData) => {
    try {
        // Validar campos requeridos
        const missingFields = DishModel.requiredFields.filter(
            field => !dishData[field]
        );

        if (missingFields.length > 0) {
            throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }

        // Validar formato de datos
        if (!DishModel.validations.name(dishData.name)) {
            throw new Error('Nombre inválido');
        }

        if (!DishModel.validations.description(dishData.description)) {
            throw new Error('Descripción inválida');
        }

        if (!DishModel.validations.restaurantId(dishData.restaurantId)) {
            throw new Error('ID de restaurante inválido');
        }

        const newDish = {
            ...DishModel.structure,
            name: dishData.name,
            description: dishData.description,
            restaurantId: dishData.restaurantId,
            restaurantName: dishData.restaurantName || '',
            images: dishData.images || [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), newDish);

        return {
            id: docRef.id,
            ...newDish
        };
    } catch (error) {
        console.error('Error creating dish:', error);
        throw error;
    }
};

/**
 * Actualizar un platillo
 */
export const updateDish = async (dishId, updateData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dishId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Platillo no encontrado');
        }

        const currentData = docSnap.data();

        // Solo permitir actualizar campos permitidos
        const allowedUpdates = {};
        DishModel.updatableFields.forEach(field => {
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
        console.error('Error updating dish:', error);
        throw error;
    }
};

/**
 * Eliminar un platillo (soft delete)
 */
export const deleteDish = async (dishId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, dishId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Platillo no encontrado');
        }

        await updateDoc(docRef, {
            deletedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            isActive: false
        });

        return { message: 'Platillo eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting dish:', error);
        throw error;
    }
};

export default {
    getAllDishes,
    getDishesByRestaurant,
    getDishById,
    createDish,
    updateDish,
    deleteDish
};
