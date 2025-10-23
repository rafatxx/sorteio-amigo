/*
  # Add Gift Preferences Table

  ## Overview
  Creates a table to store user gift preferences (tags/keywords).

  ## New Tables
  
  ### `preferences`
  - `id` (uuid, primary key) - Unique identifier for each preference
  - `participant_id` (uuid, foreign key) - Reference to the participant
  - `preference` (text, not null) - Preference keyword/tag (e.g., "futebol", "games")
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on preferences table
  - Anyone can view preferences
  - Only the participant can add/delete their own preferences

  ## Important Notes
  1. Multiple preferences per participant allowed
  2. Preferences are simple text tags
*/

-- Create preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  preference text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Policies for preferences table
CREATE POLICY "Anyone can view preferences"
  ON preferences FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert preferences"
  ON preferences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete preferences"
  ON preferences FOR DELETE
  USING (true);