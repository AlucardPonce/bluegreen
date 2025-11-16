import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet o el estado del servidor.');
    }
    if (error.response?.status === 0) {
      throw new Error('No se puede conectar al servidor. Posible problema de CORS.');
    }
    throw error.response?.data || { message: error.message };
  }
};

// Función para registrar un nuevo usuario con código de verificación
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    console.log('Register response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet o el estado del servidor.');
    }
    if (error.response?.status === 0) {
      throw new Error('No se puede conectar al servidor. Posible problema de CORS.');
    }
    if (error.response?.status === 409) {
      throw new Error('El email ya está registrado.');
    }
    throw error.response?.data || { message: error.message };
  }
};

// Función para verificar el email con el código recibido
export const verifyEmail = async (email, verificationCode) => {
  try {
    const response = await api.post('/users/verify-email', {
      email,
      verificationCode
    });
    console.log('Verify email response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en verificación de email:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet.');
    }
    if (error.response?.status === 400) {
      throw new Error('Código inválido o expirado. Intenta nuevamente.');
    }
    if (error.response?.status === 409) {
      throw new Error('El email ya está registrado.');
    }
    throw error.response?.data || { message: error.message };
  }
};

// Función para reenviar el código de verificación
export const resendVerificationCode = async (email) => {
  try {
    const response = await api.post('/users/resend-verification', {
      email
    });
    console.log('Resend verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error reenviando código:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet.');
    }
    if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado.');
    }
    if (error.response?.status === 400) {
      throw new Error('El email ya está verificado.');
    }
    throw error.response?.data || { message: error.message };
  }
};

// Función para solicitar recuperación de contraseña
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/users/forgot-password', {
      email
    });
    console.log('Forgot password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en forgot password:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet.');
    }
    if (error.response?.status === 404) {
      throw new Error('No existe una cuenta con ese correo.');
    }
    throw error.response?.data || { message: error.message };
  }
};

// Función para resetear la contraseña con el código
export const resetPassword = async (email, verificationCode, newPassword) => {
  try {
    const response = await api.post('/users/reset-password', {
      email,
      verificationCode,
      newPassword
    });
    console.log('Reset password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en reset password:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica tu internet.');
    }
    if (error.response?.status === 400) {
      throw new Error('Código inválido o expirado.');
    }
    throw error.response?.data || { message: error.message };
  }
};