import axios from 'axios';

// Instancia base de Axios
const api = axios.create({
  //baseURL: 'https://proyecto-back-integradora.onrender.com/api',
  //baseURL: 'http://localhost:3000/api', // Descomenta para desarrollo local
  baseURL: 'http://64.227.90.188:3001/api',
  timeout: 60000, // 60 segundos para dar tiempo a que Render despierte
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: redirigir a login o cerrar sesión
      console.warn('Sesión expirada o no autorizada');
      // window.location.href = '/login'; // descomenta si quieres redirigir
    }
    return Promise.reject(error);
  }
);

export default api;