/*
  # Booking System Schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `cleaner_id` (uuid, references cleaner_profiles)
      - `service_date` (timestamptz)
      - `duration_hours` (numeric)
      - `total_amount` (numeric)
      - `status` (text)
      - `service_type` (text)
      - `special_instructions` (text)
      - `address` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for:
      - Clients can create and view their bookings
      - Cleaners can view and update their assigned bookings
*/

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) NOT NULL,
  cleaner_id uuid REFERENCES cleaner_profiles(id) NOT NULL,
  service_date timestamptz NOT NULL,
  duration_hours numeric NOT NULL CHECK (duration_hours > 0),
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  service_type text NOT NULL,
  special_instructions text,
  address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clients can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Cleaners can view assigned bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can update assigned bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = cleaner_id);