// Modelo de Restaurante - Define la estructura de datos
export const RestaurantModel = {
    // Estructura base del restaurante
    structure: {
        name: '',
        schedule: '',
        latitude: null,
        longitude: null,
        isActive: true,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
    },

    // Campos requeridos para creación
    requiredFields: ['name', 'schedule', 'latitude', 'longitude'],

    // Campos que se pueden actualizar
    updatableFields: ['name', 'schedule', 'latitude', 'longitude', 'isActive'],

    // Validaciones básicas
    validations: {
        name: /.{3,}/, // mínimo 3 caracteres
        schedule: /.{3,}/, // mínimo 3 caracteres
        latitude: (val) => typeof val === 'number' && val >= -90 && val <= 90,
        longitude: (val) => typeof val === 'number' && val >= -180 && val <= 180
    }
};
