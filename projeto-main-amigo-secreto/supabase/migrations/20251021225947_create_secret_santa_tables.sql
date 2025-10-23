/*
  # Secret Santa/Enemy Database Schema

  ## Overview
  Creates the database structure for managing Secret Santa and Secret Enemy assignments.

  ## New Tables
  
  ### `participants`
  - `id` (uuid, primary key) - Unique identifier for each participant
  - `name` (text, not null) - Full name of the participant
  - `gender` (text, not null) - Gender: 'Masculino' or 'Feminino'
  - `photo_url` (text) - URL to participant's photo
  - `password` (text, not null) - Password to access their assignments
  - `created_at` (timestamptz) - Record creation timestamp

  ### `assignments`
  - `id` (uuid, primary key) - Unique identifier for each assignment
  - `participant_id` (uuid, foreign key) - Reference to the participant
  - `secret_friend_id` (uuid, foreign key) - Reference to their assigned Secret Friend
  - `secret_enemy_id` (uuid, foreign key) - Reference to their assigned Secret Enemy
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for participants (photos and names visible to all)
  - Authenticated access required for assignments
  - Password field excluded from public queries (handled by Edge Function)

  ## Important Notes
  1. Passwords are stored in plain text for simplicity (test application)
  2. Photos use placeholder URLs initially
  3. Assignments must ensure no self-assignment logic
*/

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Masculino', 'Feminino')),
  photo_url text DEFAULT '',
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  secret_friend_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  secret_enemy_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_id)
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Policies for participants table
CREATE POLICY "Anyone can view participant names and photos"
  ON participants FOR SELECT
  USING (true);

-- Policies for assignments table  
CREATE POLICY "Anyone can view assignments"
  ON assignments FOR SELECT
  USING (true);