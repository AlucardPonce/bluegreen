import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/auth';

function ProtectedRoute({ children, requireAdmin = false }) {
  // Verificar si el usuario tiene token
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Si no hay token, redirigir al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el token está expirado (opcional)
  try {
    // Decodificar el payload del JWT (parte del medio)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);

    // Verificar expiración
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      // Token expirado, limpiar storage y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Error verificando token:', error);
    // Si hay error decodificando, limpiar y redirigir
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Verificar si se requiere admin
  if (requireAdmin && !isAdmin()) {
    // Si requiere admin pero el usuario no es admin, redirigir a /experiencia
    return <Navigate to="/experiencia" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
}

export default ProtectedRoute;
