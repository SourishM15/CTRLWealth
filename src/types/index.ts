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

export interface FilterState {
  region: 'us' | 'washington' | 'comparison';
  timeframe: 'current' | 'historical' | 'forecast';
  metrics: string[];
  yearRange: [number, number];
}

export interface TimeSeriesData {
  year: number;
  value: number;
}

export interface InequalityMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  historicalValues: TimeSeriesData[];
  forecastValues: TimeSeriesData[];
  unit: string;
  domain: [number, number];
}

export interface RegionData {
  id: string;
  name: string;
  metrics: InequalityMetric[];
}