/*
  # Seattle Neighborhoods Demographics Schema

  1. New Tables
    - `seattle_neighborhoods`
      - `id` (text, primary key) - Neighborhood identifier
      - `name` (text) - Neighborhood name
      - `type` (text) - Neighborhood type (CRA, UCUV, CD)
      - `created_at` (timestamptz) - Record creation timestamp

    - `seattle_demographics`
      - `id` (uuid, primary key)
      - `neighborhood_id` (text, foreign key)
      - `children_under_18` (integer)
      - `working_age_adults_18_64` (integer)
      - `older_adults_65_over` (integer)
      - `aggregate_age_total` (numeric)
      - `aggregate_age_male` (numeric)
      - `aggregate_age_female` (numeric)
      - `median_age_total` (numeric)
      - `median_age_male` (numeric)
      - `median_age_female` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create seattle_neighborhoods table
CREATE TABLE seattle_neighborhoods (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seattle_neighborhoods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seattle_neighborhoods"
  ON seattle_neighborhoods
  FOR SELECT
  TO public
  USING (true);

-- Create seattle_demographics table
CREATE TABLE seattle_demographics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id text REFERENCES seattle_neighborhoods(id) ON DELETE CASCADE,
  children_under_18 integer NOT NULL,
  working_age_adults_18_64 integer NOT NULL,
  older_adults_65_over integer NOT NULL,
  aggregate_age_total numeric NOT NULL,
  aggregate_age_male numeric NOT NULL,
  aggregate_age_female numeric NOT NULL,
  median_age_total numeric NOT NULL,
  median_age_male numeric NOT NULL,
  median_age_female numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seattle_demographics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to seattle_demographics"
  ON seattle_demographics
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX seattle_demographics_neighborhood_idx ON seattle_demographics(neighborhood_id);