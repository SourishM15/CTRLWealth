/*
  # Seed Initial Data

  1. Data Population
    - Add US and Washington regions
    - Add core inequality metrics
    - Add sample historical and forecast data
*/

-- Insert regions
INSERT INTO regions (id, name) VALUES
  ('us', 'United States'),
  ('washington', 'Washington State');

-- Insert metrics
INSERT INTO metrics (id, name, description, unit, domain_min, domain_max) VALUES
  ('gini', 'Gini Coefficient', 'Measures income inequality where 0 represents perfect equality and 1 represents perfect inequality', '', 0, 1),
  ('income-ratio', 'Income Ratio (Top 10% / Bottom 50%)', 'Ratio of income between the top 10% and bottom 50% of earners', 'x', 0, 30),
  ('poverty-rate', 'Poverty Rate', 'Percentage of population living below the poverty line', '%', 0, 20),
  ('wealth-top1', 'Wealth Share (Top 1%)', 'Percentage of total wealth owned by the top 1%', '%', 0, 50);

-- Insert sample historical data (2000-2023)
WITH years AS (
  SELECT generate_series(2000, 2023) AS year
)
INSERT INTO metric_values (region_id, metric_id, year, value, is_forecast)
SELECT
  r.id AS region_id,
  m.id AS metric_id,
  y.year,
  CASE 
    WHEN m.id = 'gini' THEN 
      CASE r.id 
        WHEN 'us' THEN 0.45 + (random() * 0.05)
        ELSE 0.42 + (random() * 0.04)
      END
    WHEN m.id = 'income-ratio' THEN
      CASE r.id
        WHEN 'us' THEN 15 + (random() * 3)
        ELSE 13 + (random() * 2)
      END
    WHEN m.id = 'poverty-rate' THEN
      CASE r.id
        WHEN 'us' THEN 12 + (random() * 2)
        ELSE 10 + (random() * 1.5)
      END
    ELSE -- wealth-top1
      CASE r.id
        WHEN 'us' THEN 30 + (random() * 5)
        ELSE 25 + (random() * 4)
      END
  END AS value,
  false AS is_forecast
FROM regions r
CROSS JOIN metrics m
CROSS JOIN years y;

-- Insert forecast data (2024-2035)
WITH years AS (
  SELECT generate_series(2024, 2035) AS year
)
INSERT INTO metric_values (region_id, metric_id, year, value, is_forecast)
SELECT
  r.id AS region_id,
  m.id AS metric_id,
  y.year,
  CASE 
    WHEN m.id = 'gini' THEN 
      CASE r.id 
        WHEN 'us' THEN 0.48 + (random() * 0.05)
        ELSE 0.44 + (random() * 0.04)
      END
    WHEN m.id = 'income-ratio' THEN
      CASE r.id
        WHEN 'us' THEN 17 + (random() * 3)
        ELSE 14 + (random() * 2)
      END
    WHEN m.id = 'poverty-rate' THEN
      CASE r.id
        WHEN 'us' THEN 11 + (random() * 2)
        ELSE 9 + (random() * 1.5)
      END
    ELSE -- wealth-top1
      CASE r.id
        WHEN 'us' THEN 35 + (random() * 5)
        ELSE 28 + (random() * 4)
      END
  END AS value,
  true AS is_forecast
FROM regions r
CROSS JOIN metrics m
CROSS JOIN years y;