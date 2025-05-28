/*
  # Initial database setup

  1. New Tables
    - regions: Stores information about geographical regions (US and Washington)
    - metrics: Stores different types of inequality measurements
    - metric_values: Stores historical and forecast values for each metric

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
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