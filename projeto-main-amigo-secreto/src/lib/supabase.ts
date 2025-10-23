import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
