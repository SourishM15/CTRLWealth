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
  {
    id: 'north_delridge',
    name: 'North Delridge',
    type: 'CRA',
    demographics: {
      children_under_18: 530,
      working_age_adults_18_64: 4689,
      older_adults_65_over: 584,
      aggregate_age_total: 225236.6,
      aggregate_age_male: 112036.2,
      aggregate_age_female: 111015.1,
      median_age_total: 38.8,
      median_age_male: 39.1,
      median_age_female: 37.7
    }
  },
  {
    id: 'high_point',
    name: 'High Point',
    type: 'CRA',
    demographics: {
      children_under_18: 2366,
      working_age_adults_18_64: 6122,
      older_adults_65_over: 744,
      aggregate_age_total: 316446.6,
      aggregate_age_male: 154075.6,
      aggregate_age_female: 162133.9,
      median_age_total: 34.2,
      median_age_male: 34.4,
      median_age_female: 34.0
    }
  }
];