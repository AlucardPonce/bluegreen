/**
 * Modelo de Platillo
 */
export const DishModel = {
    structure: {
        name: '',
        description: '',
        restaurantId: '',
        restaurantName: '',
        images: [],
        isActive: true,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
    },
    requiredFields: ['name', 'description', 'restaurantId'],
    updatableFields: ['name', 'description', 'restaurantId', 'restaurantName', 'images', 'isActive'],
    validations: {
        name: (val) => typeof val === 'string' && val.trim().length > 0,
        description: (val) => typeof val === 'string' && val.trim().length > 0,
        restaurantId: (val) => typeof val === 'string' && val.trim().length > 0,
        images: (val) => Array.isArray(val)
    }
};

export default DishModel;
