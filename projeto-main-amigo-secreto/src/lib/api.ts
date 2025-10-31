import axios from 'axios';
import type { Participant, Assignment } from './types'; // <-- Adicione Assignment aqui

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/'
});

// --- Função de Login com tipos ---
export const login = (username: string, password: string) => {
  return apiClient.post<{ access: string, refresh: string }>('/token/', { username, password });
  // Adicionei o tipo de retorno esperado: { access: string, refresh: string }
};

// --- Função para buscar participantes ---
export const getParticipants = async (): Promise<Participant[]> => {
  // TODO: Adicionar header de autenticação aqui!
  const response = await apiClient.get('/participants/');
  return response.data;
};

// --- NOVA FUNÇÃO para buscar o sorteio ---
export const getAssignments = async (): Promise<Assignment[]> => {
  // TODO: Adicionar header de autenticação aqui também!
  const response = await apiClient.get('/assignments/'); // <-- Verifique se a URL no Django é essa
  return response.data;
};