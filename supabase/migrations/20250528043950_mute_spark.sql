/*
  # Add remaining Seattle neighborhoods and demographics

  1. New Data
    - Add remaining Seattle neighborhoods from the CSV
    - Insert corresponding demographic data
*/

-- Insert remaining neighborhoods
INSERT INTO seattle_neighborhoods (id, name, type)
VALUES
  ('olympic_hills', 'Olympic Hills/Victory Heights', 'CRA'),
  ('cedar_park', 'Cedar Park/Meadowbrook', 'CRA'),
  ('broadview', 'Broadview/Bitter Lake', 'CRA'),
  ('licton_springs', 'Licton Springs', 'CRA'),
  ('greenwood', 'Greenwood/Phinney Ridge', 'CRA'),
  ('green_lake', 'Green Lake', 'CRA'),
  ('haller_lake', 'Haller Lake', 'CRA'),
  ('north_beach', 'North Beach/Blue Ridge', 'CRA'),
  ('whittier_heights', 'Whittier Heights', 'CRA'),
  ('sunset_hill', 'Sunset Hill/Loyal Heights', 'CRA'),
  ('ballard', 'Ballard', 'CRA'),
  ('fremont', 'Fremont', 'CRA'),
  ('wallingford', 'Wallingford', 'CRA'),
  ('cascade', 'Cascade/Eastlake', 'CRA'),
  ('magnolia', 'Magnolia', 'CRA'),
  ('interbay', 'Interbay', 'CRA'),
  ('queen_anne', 'Queen Anne', 'CRA'),
  ('belltown', 'Belltown', 'CRA'),
  ('downtown', 'Downtown Commercial Core', 'CRA'),
  ('pioneer_square', 'Pioneer Square/International District', 'CRA');

-- Insert remaining demographic data
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
  ('olympic_hills', 2846, 11843, 2402, 680835.2, 356446.2, 318364.3, 39.8, 38.8, 40.2),
  ('cedar_park', 2222, 9608, 2757, 600447.4, 312550.0, 290145.2, 41.1, 41.4, 41.1),
  ('broadview', 2910, 9425, 3616, 720997.9, 314514.6, 414929.3, 45.2, 43.1, 47.9),
  ('licton_springs', 907, 7802, 957, 335986.4, 165607.1, 163810.8, 34.7, 34.1, 33.9),
  ('greenwood', 4303, 19698, 3272, 1033290.0, 514005.6, 525473.6, 37.8, 37.3, 38.8),
  ('green_lake', 2521, 12564, 2426, 656520.4, 317763.5, 332506.1, 37.4, 37.8, 36.4),
  ('haller_lake', 1987, 7494, 1398, 403515.9, 212777.2, 188205.3, 37.0, 38.1, 35.4),
  ('north_beach', 2474, 8252, 1997, 550594.4, 278710.3, 263701.7, 43.2, 42.7, 42.4),
  ('whittier_heights', 2499, 11081, 1000, 508922.9, 255847.8, 258050.2, 34.9, 35.2, 35.2),
  ('sunset_hill', 3124, 10352, 2690, 675322.8, 330954.2, 345359.8, 41.7, 40.1, 43.5),
  ('ballard', 1088, 9152, 925, 369056.7, 173536.0, 197761.1, 33.0, 32.0, 34.3),
  ('fremont', 1700, 15408, 1511, 622398.5, 305926.4, 316414.8, 33.4, 33.6, 33.1),
  ('wallingford', 2287, 14701, 1446, 597376.3, 302010.0, 293672.6, 32.4, 33.8, 30.9),
  ('cascade', 597, 25287, 2470, 909985.2, 510235.7, 426387.3, 32.0, 32.6, 33.4),
  ('magnolia', 3385, 7906, 2481, 610561.6, 285302.8, 325009.1, 44.3, 43.3, 45.2),
  ('interbay', 1444, 9504, 1156, 429284.1, 227634.9, 205046.3, 35.4, 35.5, 35.9),
  ('queen_anne', 4314, 36166, 5025, 1598747.0, 782431.9, 815743.8, 35.1, 34.1, 36.0),
  ('belltown', 204, 9998, 1096, 433538.6, 218052.3, 212804.3, 38.3, 36.4, 40.0),
  ('downtown', 175, 5109, 1016, 283457.3, 153125.3, 128373.3, 44.9, 44.7, 44.6),
  ('pioneer_square', 393, 4598, 1555, 263965.5, 156695.3, 116484.7, 40.3, 39.1, 45.7);