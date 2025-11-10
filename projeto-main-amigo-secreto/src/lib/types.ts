export interface Participant {
  id: string;
  user_id: number;
  name: string;
  username: string;
  gender: 'Masculino' | 'Feminino' | 'Não Binário';
  photo_url: string;
  gostos_pessoais: string;
}

export interface Resultado {
  id: number;
  doador: number;
  receptor: number;
  grupo: number;
  tipo_sorteio: 'amigo' | 'inimigo';
}