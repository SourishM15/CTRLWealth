import React, { useEffect, useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import SeattleMap from '../components/SeattleMap';
import { fetchSeattleNeighborhoods, SeattleNeighborhood } from '../services/seattleService';

const HomePage: React.FC = () => {
  const [neighborhoods, setNeighborhoods] = useState<SeattleNeighborhood[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SeattleNeighborhood | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSeattleNeighborhoods();
        setNeighborhoods(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading neighborhoods:', err);
        setError('Failed to load neighborhood data');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNeighborhoodSelect = (neighborhood: SeattleNeighborhood) => {
    setSelectedNeighborhood(neighborhood);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Seattle neighborhood data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <ChatInterface onChatQuery={() => {}} />
        </div>
        
        <div className="lg:col-span-9">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Seattle Neighborhoods Demographics
            </h2>
            
            {selectedNeighborhood && selectedNeighborhood.demographics && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-800">Children Under 18</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {selectedNeighborhood.demographics.children_under_18.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-800">Working Age Adults</h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {selectedNeighborhood.demographics.working_age_adults_18_64.toLocaleString()}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-amber-800">Median Age</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    {selectedNeighborhood.demographics.median_age_total}
                  </p>
                </div>
              </div>
            )}
            
            <SeattleMap 
              neighborhoods={neighborhoods}
              onNeighborhoodSelect={handleNeighborhoodSelect}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;