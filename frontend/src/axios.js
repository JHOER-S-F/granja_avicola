import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar un interceptor para agregar el token a cada solicitud
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
