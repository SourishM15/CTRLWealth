/*
  # Insert Seattle Demographics Data

  1. Data Import
    - Insert neighborhood records
    - Insert corresponding demographic data
    
  2. Data Source
    - Data imported from provided CSV file
    - Contains demographic information for Seattle neighborhoods
*/

-- Insert neighborhoods
INSERT INTO seattle_neighborhoods (id, name, type)
VALUES
  ('alki_admiral', 'Alki/Admiral', 'CRA'),
  ('north_delridge', 'North Delridge', 'CRA'),
  ('high_point', 'High Point', 'CRA'),
  ('riverview', 'Riverview', 'CRA'),
  ('roxhill_westwood', 'Roxhill/Westwood', 'CRA'),
  ('highland_park', 'Highland Park', 'CRA'),
  ('south_park', 'South Park', 'CRA'),
  ('georgetown', 'Georgetown', 'CRA'),
  ('duwamish_sodo', 'Duwamish/SODO', 'CRA'),
  ('south_beacon_hill', 'South Beacon Hill/NewHolly', 'CRA'),
  ('beacon_hill', 'Beacon Hill', 'CRA'),
  ('north_beacon_hill', 'North Beacon Hill/Jefferson Park', 'CRA'),
  ('rainier_beach', 'Rainier Beach', 'CRA'),
  ('columbia_city', 'Columbia City', 'CRA'),
  ('seward_park', 'Seward Park', 'CRA'),
  ('mt_baker', 'Mt. Baker/North Rainier', 'CRA'),
  ('madrona_leschi', 'Madrona/Leschi', 'CRA'),
  ('judkins_park', 'Judkins Park', 'CRA'),
  ('central_area', 'Central Area/Squire Park', 'CRA'),
  ('first_hill', 'First Hill', 'CRA'),
  ('capitol_hill', 'Capitol Hill', 'CRA'),
  ('north_capitol_hill', 'North Capitol Hill', 'CRA'),
  ('miller_park', 'Miller Park', 'CRA'),
  ('madison_park', 'Madison Park', 'CRA'),
  ('montlake', 'Montlake/Portage Bay', 'CRA'),
  ('university_district', 'University District', 'CRA'),
  ('ravenna_bryant', 'Ravenna/Bryant', 'CRA'),
  ('wedgwood', 'Wedgwood/View Ridge', 'CRA'),
  ('laurelhurst', 'Laurelhurst/Sand Point', 'CRA'),
  ('northgate', 'Northgate/Maple Leaf', 'CRA');

-- Insert demographic data
INSERT INTO seattle_demographics (
  neighborhood_id,
  children_under_18,
  working_age_adults_18_64,
  older_adults_65_over,
  aggregate_age_total,
  aggregate_age_male,
  aggregate_age_female,
  median_age_total,
  median_age_male,
  median_age_female
)
VALUES
  ('alki_admiral', 1789, 7929, 2368, 541763.6, 255666.9, 288738.0, 44.8, 42.6, 47.3),
  ('north_delridge', 530, 4689, 584, 225236.6, 112036.2, 111015.1, 38.8, 39.1, 37.7),
  ('high_point', 2366, 6122, 744, 316446.6, 154075.6, 162133.9, 34.2, 34.4, 34.0),
  ('riverview', 1074, 3500, 449, 190119.7, 101969.0, 90069.6, 37.8, 37.9, 38.5),
  ('roxhill_westwood', 2362, 10034, 1588, 535730.2, 249357.1, 284797.8, 38.3, 36.8, 39.5),
  ('highland_park', 1490, 5381, 1281, 310788.6, 140588.3, 177422.9, 38.1, 35.8, 41.9),
  ('south_park', 983, 2734, 343, 134756.0, 78494.6, 62157.3, 33.1, 35.3, 33.8),
  ('georgetown', 115, 912, 154, 46654.4, 28989.0, 18264.9, 39.5, 42.3, 36.7),
  ('duwamish_sodo', 244, 2611, 509, 137220.6, 83488.3, 55075.0, 40.7, 41.5, 40.6),
  ('south_beacon_hill', 3094, 9920, 2596, 600616.8, 297637.6, 307555.1, 38.4, 37.1, 40.5);