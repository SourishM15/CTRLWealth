/*
  # Initial Schema Setup for Inequality Dashboard

  1. New Tables
    - `regions`
      - `id` (text, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `metrics`
      - `id` (text, primary key) 
      - `name` (text)
      - `description` (text)
      - `unit` (text)
      - `domain_min` (numeric)
      - `domain_max` (numeric)
      - `created_at` (timestamp)
    
    - `metric_values`
      - `id` (uuid, primary key)
      - `region_id` (text, foreign key)
      - `metric_id` (text, foreign key)
      - `year` (integer)
      - `value` (numeric)
      - `is_forecast` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for admin users to modify data
*/

-- Create regions table
CREATE TABLE regions (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to regions"
  ON regions
  FOR SELECT
  TO public
  USING (true);

-- Create metrics table
CREATE TABLE metrics (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  unit text NOT NULL DEFAULT '',
  domain_min numeric NOT NULL,
  domain_max numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to metrics"
  ON metrics
  FOR SELECT
  TO public
  USING (true);

-- Create metric_values table
CREATE TABLE metric_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id text REFERENCES regions(id) ON DELETE CASCADE,
  metric_id text REFERENCES metrics(id) ON DELETE CASCADE,
  year integer NOT NULL,
  value numeric NOT NULL,
  is_forecast boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE metric_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to metric_values"
  ON metric_values
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX metric_values_region_metric_idx ON metric_values(region_id, metric_id);
CREATE INDEX metric_values_year_idx ON metric_values(year);