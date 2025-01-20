/*
  # Review System Schema

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `reviewer_id` (uuid, references profiles)
      - `reviewee_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reviews` table
    - Add policies for:
      - Users can create reviews for their bookings
      - Users can view reviews they've given or received
      - Public can view cleaner reviews
*/

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) NOT NULL,
  reviewee_id uuid REFERENCES profiles(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create reviews for their bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_id
      AND (client_id = auth.uid() OR cleaner_id = auth.uid())
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can view reviews they're involved with"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE POLICY "Public can view cleaner reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cleaner_profiles
      WHERE id = reviewee_id
    )
  );