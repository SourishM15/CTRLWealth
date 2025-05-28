/*
  # Seattle Demographics Schema

  1. New Tables
    - `neighborhoods`
      - `id` (text, primary key)
      - `name` (text)
      - `type` (text) - CRA, UCUV, CD, etc.
      - `created_at` (timestamp)
    
    - `demographic_metrics`
      - `id` (uuid, primary key)
      - `neighborhood_id` (text, foreign key)
      - `year` (integer)
      - `children_under_18` (integer)
      - `working_age_adults` (integer)
      - `older_adults` (integer)
      - `aggregate_age_total` (numeric)
      - `aggregate_age_male` (numeric)
      - `aggregate_age_female` (numeric)
      - `median_age_total` (numeric)
      - `median_age_male` (numeric)
      - `median_age_female` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create neighborhoods table
CREATE TABLE neighborhoods (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO public
  USING (true);

-- Create demographic metrics table
CREATE TABLE demographic_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id text REFERENCES neighborhoods(id) ON DELETE CASCADE,
  year integer NOT NULL,
  children_under_18 integer NOT NULL,
  working_age_adults integer NOT NULL,
  older_adults integer NOT NULL,
  aggregate_age_total numeric NOT NULL,
  aggregate_age_male numeric NOT NULL,
  aggregate_age_female numeric NOT NULL,
  median_age_total numeric NOT NULL,
  median_age_male numeric NOT NULL,
  median_age_female numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demographic_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to demographic_metrics"
  ON demographic_metrics
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX demographic_metrics_neighborhood_idx ON demographic_metrics(neighborhood_id);
CREATE INDEX demographic_metrics_year_idx ON demographic_metrics(year);