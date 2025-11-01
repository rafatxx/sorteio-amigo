import axios from 'axios';
import type { Participant } from './types'; 

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

export const login = (username: string, password: string) => {
  return apiClient.post('/token/', { username, password });
};

export const getParticipants = async (): Promise<Participant[]> => {
  const response = await apiClient.get('/participants/');
  return response.data;
};

export const getAssignments = async () => { 
  const response = await apiClient.get('/assignments/');
  return response.data;
};