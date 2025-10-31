export interface Participant {
  id: string;
  name: string;
  gender: 'Masculino' | 'Feminino';
  photo_url: string;
  password: string;
}

export interface Assignment {
  id: string;
  participant_id: string;
  secret_friend_id: string;
  secret_enemy_id: string;
}