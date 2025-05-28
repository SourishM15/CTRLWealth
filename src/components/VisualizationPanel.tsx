import React from 'react';
import { FilterState, InequalityMetric } from '../types';
import { getMetricById, getRegionById } from '../data/inequalityData';
import LineChart from './charts/LineChart.tsx';
import BarChart from './charts/BarChart.tsx';
import Analysis from './Analysis';

interface VisualizationPanelProps {
  filters: FilterState;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ filters }) => {
  // Helper functions to get the appropriate data based on filters
  const getFilteredMetrics = (regionId: string): InequalityMetric[] => {
    const region = getRegionById(regionId);
    if (!region) return [];
    
    return region.metrics.filter(metric => 
      filters.metrics.length === 0 || filters.metrics.includes(metric.id)
    );
  };

  // Get metrics for selected region(s)
  const primaryMetrics = filters.region === 'comparison' 
    ? getFilteredMetrics('us') 
    : getFilteredMetrics(filters.region);
    
  const comparisonMetrics = filters.region === 'comparison' 
    ? getFilteredMetrics('washington') 
    : undefined;

  // Render appropriate charts based on timeframe
  const renderCharts = () => {
    if (filters.timeframe === 'current') {
      // Show bar charts for current values
      return (
        <div className="grid grid-cols-1 gap-6 mb-6">
          <BarChart 
            metrics={primaryMetrics} 
            compareMetrics={comparisonMetrics}
            title={filters.region === 'comparison' ? "US vs. Washington State Current Values" : "Current Values"}
          />
        </div>
      );
    } else if (filters.timeframe === 'historical' || filters.timeframe === 'forecast') {
      // Show line charts for time series data
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {primaryMetrics.map(metric => (
            <LineChart
              key={metric.id}
              title={metric.name}
              data={
                filters.timeframe === 'historical' 
                  ? metric.historicalValues.filter(
                      d => d.year >= filters.yearRange[0] && d.year <= filters.yearRange[1]
                    )
                  : metric.historicalValues.filter(d => d.year <= 2023)
              }
              forecastData={
                filters.timeframe === 'forecast' 
                  ? metric.forecastValues.filter(
                      d => d.year >= Math.max(2024, filters.yearRange[0]) && d.year <= filters.yearRange[1]
                    )
                  : undefined
              }
              unit={metric.unit}
              domain={metric.domain}
            />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div>
      {renderCharts()}
      <Analysis filters={filters} />
    </div>
  );
};

export default VisualizationPanel;