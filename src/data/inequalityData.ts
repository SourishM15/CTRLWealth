import { fetchRegions } from '../services/dataService';

// Initialize regions data
let regions = [];
let usMetrics = [];
let washingtonMetrics = [];

// Load data
const loadData = async () => {
  try {
    regions = await fetchRegions();
    usMetrics = regions.find(r => r.id === 'us')?.metrics || [];
    washingtonMetrics = regions.find(r => r.id === 'washington')?.metrics || [];
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Load data immediately
loadData();

// Helper functions to get data
export const getMetricById = (regionId: string, metricId: string) => {
  const region = regions.find(r => r.id === regionId);
  if (!region) return undefined;
  
  return region.metrics.find(m => m.id === metricId);
};

export const getRegionById = (regionId: string) => {
  return regions.find(r => r.id === regionId);
};

// Export data and functions
export { regions, usMetrics, washingtonMetrics };