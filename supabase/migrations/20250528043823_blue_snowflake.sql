/*
  # Insert Seattle Demographics Data

  1. Data Population
    - Insert neighborhood records
    - Insert demographic metrics for each neighborhood
    - Current year data only (historical data can be added later)

  2. Notes
    - All data is from the provided CSV file
    - Using 2023 as the reference year
*/

-- Insert neighborhoods
INSERT INTO neighborhoods (id, name, type)
VALUES
  ('alki_admiral', 'Alki/Admiral', 'CRA'),
  ('north_delridge', 'North Delridge', 'CRA'),
  ('high_point', 'High Point', 'CRA'),
  ('riverview', 'Riverview', 'CRA'),
  ('roxhill_westwood', 'Roxhill/Westwood', 'CRA')
  -- Add more neighborhoods as needed
;

-- Insert demographic metrics (sample for first few neighborhoods)
INSERT INTO demographic_metrics (
  neighborhood_id,
  year,
  children_under_18,
  working_age_adults,
  older_adults,
  aggregate_age_total,
  aggregate_age_male,
  aggregate_age_female,
  median_age_total,
  median_age_male,
  median_age_female
)
VALUES
  (
    'alki_admiral',
    2023,
    1789,
    7929,
    2368,
    541763.6,
    255666.9,
    288738.0,
    44.8,
    42.6,
    47.3
  ),
  (
    'north_delridge',
    2023,
    530,
    4689,
    584,
    225236.6,
    112036.2,
    111015.1,
    38.8,
    39.1,
    37.7
  ),
  (
    'high_point',
    2023,
    2366,
    6122,
    744,
    316446.6,
    154075.6,
    162133.9,
    34.2,
    34.4,
    34.0
  ),
  (
    'riverview',
    2023,
    1074,
    3500,
    449,
    190119.7,
    101969.0,
    90069.6,
    37.8,
    37.9,
    38.5
  ),
  (
    'roxhill_westwood',
    2023,
    2362,
    10034,
    1588,
    535730.2,
    249357.1,
    284797.8,
    38.3,
    36.8,
    39.5
  )
  -- Add more demographic data as needed
;