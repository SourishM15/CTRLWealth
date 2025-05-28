import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChatInterface from '../components/ChatInterface';
import { seattleNeighborhoods } from '../data/seattleData';
import { SeattleNeighborhood } from '../types';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<SeattleNeighborhood | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 800;
    const height = 600;

    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-black text-white p-2 rounded text-sm")
      .style("pointer-events", "none");

    // Seattle map path data
    const seattlePath = "M 400 100 L 500 100 L 500 300 L 450 400 L 400 450 L 350 500 L 300 450 L 250 400 L 300 300 L 300 200 L 350 150 L 400 100 Z";

    // Draw Seattle outline
    svg.append("path")
      .attr("d", seattlePath)
      .attr("fill", "#4F46E5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.2);

    // Add neighborhood markers
    seattleNeighborhoods.forEach(neighborhood => {
      const coords = getNeighborhoodCoords(neighborhood.id);
      
      const group = svg.append("g")
        .attr("transform", `translate(${coords.x},${coords.y})`);

      // Add circle marker
      group.append("circle")
        .attr("r", 15)
        .attr("fill", neighborhood.id === selectedNeighborhood?.id ? "#10B981" : "#4F46E5")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .on("mouseover", (event) => {
          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("r", 18);

          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html(neighborhood.name)
            .classed("hidden", false);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("opacity", 0.8)
            .attr("r", 15);

          tooltip.classed("hidden", true);
        })
        .on("click", () => {
          setSelectedNeighborhood(neighborhood);
        });

      // Add label
      group.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 25)
        .attr("fill", "#1F2937")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text(neighborhood.name);
    });

    return () => {
      tooltip.remove();
    };
  }, [selectedNeighborhood]);

  // Helper function to get neighborhood coordinates
  const getNeighborhoodCoords = (id: string): { x: number; y: number } => {
    const coords: { [key: string]: { x: number; y: number } } = {
      capitol_hill: { x: 400, y: 300 },
      ballard: { x: 300, y: 200 },
      queen_anne: { x: 350, y: 250 },
      fremont: { x: 350, y: 180 },
      u_district: { x: 450, y: 200 },
      central_district: { x: 450, y: 300 }
    };
    return coords[id] || { x: 400, y: 300 }; // Default to center
  };

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

            <div className="w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
              <svg ref={mapRef} className="w-full h-full" />
            </div>

            {selectedNeighborhood && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedNeighborhood.name} Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Children:</strong> {selectedNeighborhood.demographics.children_under_18.toLocaleString()}</p>
                    <p><strong>Working Age:</strong> {selectedNeighborhood.demographics.working_age_adults_18_64.toLocaleString()}</p>
                    <p><strong>Seniors:</strong> {selectedNeighborhood.demographics.older_adults_65_over.toLocaleString()}</p>
                  </div>
                  <div>
                    <p><strong>Median Age:</strong> {selectedNeighborhood.demographics.median_age_total}</p>
                    <p><strong>Median Age (Male):</strong> {selectedNeighborhood.demographics.median_age_male}</p>
                    <p><strong>Median Age (Female):</strong> {selectedNeighborhood.demographics.median_age_female}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;