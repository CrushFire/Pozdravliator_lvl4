import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7138', // URL твоего API
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;