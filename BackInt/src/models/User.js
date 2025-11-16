// Modelo de Usuario - Define la estructura de datos
export const UserModel = {
    // Estructura base del usuario
    structure: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: null,
        role: 'user', // 'user', 'business', 'admin'
        isActive: true,
        emailVerified: false,
        emailVerificationCode: null,
        emailVerificationExpires: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
    },

    // Roles permitidos
    roles: {
        USER: 'user',
        BUSINESS: 'business',
        ADMIN: 'admin'
    },

    // Campos requeridos para registro
    requiredFields: ['email', 'password', 'firstName', 'lastName'],

    // Campos que se pueden actualizar
    updatableFields: ['firstName', 'lastName', 'phone', 'emailVerified', 'emailVerificationCode', 'emailVerificationExpires'],

    // Campos que no se deben devolver en responses
    privateFields: ['password', 'emailVerificationCode'],

    // Validaciones básicas
    validations: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /.{6,}/, // mínimo 6 caracteres
        phone: /^[0-9+\-\s()]*$/
    }
};