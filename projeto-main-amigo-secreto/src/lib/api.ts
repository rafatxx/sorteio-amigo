import axios from 'axios';
import type { Participant, Resultado } from './types'; 

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Erro 401: Token inválido ou expirado. Limpando sessão.");
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      window.location.reload(); 
    }
    
    return Promise.reject(error);
  }
);

export const login = (username: string, password: string) => {
  return apiClient.post('/token/', { username, password });
};

export const getParticipants = async (): Promise<Participant[]> => {
  const response = await apiClient.get('/participants/');
  return response.data;
};

export const getAssignments = async (): Promise<Resultado[]> => { 
  const response = await apiClient.get('/assignments/');
  return response.data;
};