import { fetchRegions } from '../services/dataService';

// Export regions data
export const regions = await fetchRegions();

// Helper functions to get data
export const getMetricById = (regionId: string, metricId: string) => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return undefined;
  
  return region.metrics.find(m => m.id === metricId);
};

export const getRegionById = (regionId: string) => {
  return regions.find(r => r.id === regionId);
};

// Export metrics for easy access
export const usMetrics = regions.find(r => r.id === 'us')?.metrics || [];
export const washingtonMetrics = regions.find(r => r.id === 'washington')?.metrics || [];