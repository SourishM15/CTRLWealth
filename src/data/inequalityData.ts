import { fetchRegions } from '../services/dataService';
import { RegionData, InequalityMetric } from '../types';

let regions: RegionData[] = [];
let usMetrics: InequalityMetric[] = [];
let washingtonMetrics: InequalityMetric[] = [];

// Load data
export const loadData = async () => {
  try {
    console.log('Loading data from Supabase...');
    regions = await fetchRegions();
    const usRegion = regions.find(r => r.id === 'us');
    const waRegion = regions.find(r => r.id === 'washington');
    
    if (usRegion) usMetrics = usRegion.metrics;
    if (waRegion) washingtonMetrics = waRegion.metrics;
    
    console.log('Data loaded successfully:', { regions, usMetrics, washingtonMetrics });
    return { regions, usMetrics, washingtonMetrics };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

// Helper functions to get data
export const getMetricById = (regionId: string, metricId: string) => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return undefined;
  
  return region.metrics.find(m => m.id === metricId);
};

export const getRegionById = (regionId: string) => {
  return regions.find(r => r.id === regionId);
};

// Export data
export { regions, usMetrics, washingtonMetrics };