import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { seattleNeighborhoods } from '../data/seattleData';
import { SeattleNeighborhood } from '../types';

const HomePage: React.FC = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SeattleNeighborhood | null>(null);

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
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-800">Total Population</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {seattleNeighborhoods.reduce((sum, n) => 
                    sum + n.demographics.children_under_18 + 
                    n.demographics.working_age_adults_18_64 + 
                    n.demographics.older_adults_65_over, 0
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-800">Total Children</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {seattleNeighborhoods.reduce((sum, n) => 
                    sum + n.demographics.children_under_18, 0
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800">Average Median Age</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {(seattleNeighborhoods.reduce((sum, n) => 
                    sum + n.demographics.median_age_total, 0
                  ) / seattleNeighborhoods.length).toFixed(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seattleNeighborhoods.map(neighborhood => (
                <div 
                  key={neighborhood.id}
                  className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{neighborhood.name}</h3>
                  <div className="text-sm text-gray-600">
                    <p>Population: {(
                      neighborhood.demographics.children_under_18 +
                      neighborhood.demographics.working_age_adults_18_64 +
                      neighborhood.demographics.older_adults_65_over
                    ).toLocaleString()}</p>
                    <p>Median Age: {neighborhood.demographics.median_age_total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;