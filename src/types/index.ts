export interface SeattleNeighborhood {
  id: string;
  name: string;
  type: string;
  demographics: {
    children_under_18: number;
    working_age_adults_18_64: number;
    older_adults_65_over: number;
    aggregate_age_total: number;
    aggregate_age_male: number;
    aggregate_age_female: number;
    median_age_total: number;
    median_age_male: number;
    median_age_female: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
}