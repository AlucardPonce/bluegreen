// Utilidades de autenticación

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Obtener el usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Obtener el token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Guardar datos de autenticación
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};


// Obtener el nivel del usuario (admin o user)
export const getUserLevel = () => {
  const user = getCurrentUser();
  return user?.userLevel || 'user';
};

// Verificar si el usuario es admin
export const isAdmin = () => {
  return getUserLevel() === 'admin';
};
