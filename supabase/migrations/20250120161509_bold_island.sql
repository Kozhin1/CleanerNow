/*
  # Cleaner Profiles Schema

  1. New Tables
    - `cleaner_profiles`
      - `id` (uuid, primary key, references profiles)
      - `bio` (text)
      - `hourly_rate` (numeric)
      - `years_experience` (integer)
      - `service_area` (text[])
      - `services_offered` (text[])
      - `availability` (jsonb)
      - `is_verified` (boolean)
      - `verification_documents` (jsonb)
      - `insurance_info` (jsonb)
      - `background_check_status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cleaner_profiles` table
    - Add policies for:
      - Public can read verified cleaner profiles
      - Cleaners can update their own profile
      - Admin can manage all profiles
*/

CREATE TABLE cleaner_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio text,
  hourly_rate numeric NOT NULL CHECK (hourly_rate >= 0),
  years_experience integer DEFAULT 0,
  service_area text[] DEFAULT '{}',
  services_offered text[] DEFAULT '{}',
  availability jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  verification_documents jsonb DEFAULT '{}',
  insurance_info jsonb DEFAULT '{}',
  background_check_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cleaner_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view verified cleaner profiles"
  ON cleaner_profiles
  FOR SELECT
  TO anon, authenticated
  USING (is_verified = true);

CREATE POLICY "Cleaners can update own profile"
  ON cleaner_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);