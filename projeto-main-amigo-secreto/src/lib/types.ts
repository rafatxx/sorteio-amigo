export interface Participant {
  id: string;
  name: string;
  username: string;
  gender: 'Masculino' | 'Feminino';
  photo_url: string;
  gostos_pessoais: string;
}

export interface Assignment {
  id: string;
  participant_id: string;
  secret_friend_id: string;
  secret_enemy_id: string;
}