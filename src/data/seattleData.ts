import { SeattleNeighborhood } from '../types';

export const seattleNeighborhoods: SeattleNeighborhood[] = [
  {
    id: 'alki_admiral',
    name: 'Alki/Admiral',
    type: 'CRA',
    demographics: {
      children_under_18: 1789,
      working_age_adults_18_64: 7929,
      older_adults_65_over: 2368,
      aggregate_age_total: 541763.6,
      aggregate_age_male: 255666.9,
      aggregate_age_female: 288738,
      median_age_total: 44.8,
      median_age_male: 42.6,
      median_age_female: 47.3
    }
  },
  // Add all neighborhoods from the CSV here
];