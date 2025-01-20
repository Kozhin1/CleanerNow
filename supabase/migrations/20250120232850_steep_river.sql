/*
  # Add payment and messaging features

  1. New Tables
    - `payments`
      - Payment processing and history
      - Tracks payment status, amount, method
    - `messages`
      - In-app chat system
      - Supports client-cleaner communication
    - `notifications`
      - System notifications
      - Booking updates, messages, etc.
    - `tracking_sessions`
      - Real-time cleaner location tracking
    - `cleaning_checklists`
      - Quality assurance checklists
    - `disputes`
      - Dispute handling system
    - `pricing_rules`
      - Dynamic pricing rules
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text NOT NULL,
  payment_intent_id text,
  refund_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND (bookings.client_id = auth.uid() OR bookings.cleaner_id = auth.uid())
    )
  );

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  receiver_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send and view their messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  )
  WITH CHECK (
    sender_id = auth.uid()
  );

-- Notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Tracking sessions table
CREATE TABLE tracking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  cleaner_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  current_location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tracking_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cleaners can update their location"
  ON tracking_sessions
  FOR ALL
  TO authenticated
  USING (cleaner_id = auth.uid())
  WITH CHECK (cleaner_id = auth.uid());

CREATE POLICY "Clients can view cleaner location"
  ON tracking_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = tracking_sessions.booking_id
      AND bookings.client_id = auth.uid()
    )
  );

-- Cleaning checklists table
CREATE TABLE cleaning_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  completed_items jsonb NOT NULL DEFAULT '[]',
  notes text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cleaning_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cleaners can manage checklists"
  ON cleaning_checklists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = cleaning_checklists.booking_id
      AND bookings.cleaner_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view checklists"
  ON cleaning_checklists
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = cleaning_checklists.booking_id
      AND bookings.client_id = auth.uid()
    )
  );

-- Disputes table
CREATE TABLE disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) NOT NULL,
  reporter_id uuid REFERENCES profiles(id) NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their disputes"
  ON disputes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = disputes.booking_id
      AND (bookings.client_id = auth.uid() OR bookings.cleaner_id = auth.uid())
    )
  );

-- Pricing rules table
CREATE TABLE pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  conditions jsonb NOT NULL,
  price_modifier numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active pricing rules"
  ON pricing_rules
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);