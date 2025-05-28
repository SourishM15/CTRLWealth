import React, { useState, useEffect } from 'react';
import FilterControls from '../components/FilterControls';
import VisualizationPanel from '../components/VisualizationPanel';
import { FilterState } from '../types';
import { regions } from '../data/inequalityData';

const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    region: 'us',
    timeframe: 'current',
    metrics: ['gini', 'income-ratio', 'poverty-rate', 'wealth-top1'],
    yearRange: [2000, 2035]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await regions;
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <FilterControls filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <div className="lg:col-span-9">
          <VisualizationPanel filters={filters} />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;