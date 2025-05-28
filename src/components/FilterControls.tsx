import React from 'react';
import { FilterState } from '../types';
import { Sliders, Calendar, MapPin, LineChart } from 'lucide-react';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange }) => {
  const handleRegionChange = (region: FilterState['region']) => {
    onFilterChange({ region });
  };

  const handleTimeframeChange = (timeframe: FilterState['timeframe']) => {
    onFilterChange({ timeframe });
  };

  const handleMetricToggle = (metricId: string) => {
    const newMetrics = filters.metrics.includes(metricId)
      ? filters.metrics.filter(id => id !== metricId)
      : [...filters.metrics, metricId];
    
    onFilterChange({ metrics: newMetrics });
  };

  const handleYearRangeChange = (event: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = parseInt(event.target.value);
    const newYearRange = [...filters.yearRange] as [number, number];
    newYearRange[index] = value;
    
    // Ensure start year is not greater than end year
    if (index === 0 && newYearRange[0] > newYearRange[1]) {
      newYearRange[1] = newYearRange[0];
    } else if (index === 1 && newYearRange[1] < newYearRange[0]) {
      newYearRange[0] = newYearRange[1];
    }
    
    onFilterChange({ yearRange: newYearRange });
  };

  const metricOptions = [
    { id: 'gini', label: 'Gini Coefficient' },
    { id: 'income-ratio', label: 'Income Ratio' },
    { id: 'poverty-rate', label: 'Poverty Rate' },
    { id: 'wealth-top1', label: 'Wealth Share (Top 1%)' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center mb-3 text-gray-800">
          <MapPin size={18} className="mr-2 text-indigo-600" />
          Region
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleRegionChange('us')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.region === 'us' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            United States
          </button>
          <button
            onClick={() => handleRegionChange('washington')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.region === 'washington' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Washington
          </button>
          <button
            onClick={() => handleRegionChange('comparison')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.region === 'comparison' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Comparison
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center mb-3 text-gray-800">
          <Calendar size={18} className="mr-2 text-indigo-600" />
          Timeframe
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeframeChange('current')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.timeframe === 'current' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => handleTimeframeChange('historical')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.timeframe === 'historical' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Historical
          </button>
          <button
            onClick={() => handleTimeframeChange('forecast')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.timeframe === 'forecast' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Forecast
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center mb-3 text-gray-800">
          <LineChart size={18} className="mr-2 text-indigo-600" />
          Metrics
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {metricOptions.map(metric => (
            <label 
              key={metric.id}
              className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={filters.metrics.includes(metric.id)}
                onChange={() => handleMetricToggle(metric.id)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span>{metric.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold flex items-center mb-3 text-gray-800">
          <Sliders size={18} className="mr-2 text-indigo-600" />
          Year Range
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{filters.yearRange[0]}</span>
            <span>{filters.yearRange[1]}</span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min={2000}
              max={2035}
              value={filters.yearRange[0]}
              onChange={(e) => handleYearRangeChange(e, 0)}
              className="w-full"
            />
            <input
              type="range"
              min={2000}
              max={2035}
              value={filters.yearRange[1]}
              onChange={(e) => handleYearRangeChange(e, 1)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;