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

    // Create projection for Seattle
    const projection = d3.geoMercator()
      .center([-122.3321, 47.6062]) // Seattle coordinates
      .scale(80000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-black text-white p-2 rounded text-sm")
      .style("pointer-events", "none");

    // Create the GeoJSON data for Seattle
    const seattleGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Seattle" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-122.4173, 47.7511], // Northwest corner
              [-122.2449, 47.7511], // Northeast corner
              [-122.2449, 47.4959], // Southeast corner
              [-122.4173, 47.4959], // Southwest corner
              [-122.4173, 47.7511]  // Close the polygon
            ]]
          }
        }
      ]
    };

    // Draw base Seattle shape
    svg.append("path")
      .datum(seattleGeoJSON.features[0])
      .attr("d", path as any)
      .attr("fill", "#4F46E5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.2);

    // Add neighborhood markers
    seattleNeighborhoods.forEach(neighborhood => {
      // Calculate positions for neighborhoods (simplified for now)
      const coords = getNeighborhoodCoords(neighborhood.id);
      const [x, y] = projection([coords.lng, coords.lat]) || [0, 0];

      const group = svg.append("g")
        .attr("transform", `translate(${x},${y})`);

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
  const getNeighborhoodCoords = (id: string): { lat: number; lng: number } => {
    const coords: { [key: string]: { lat: number; lng: number } } = {
      capitol_hill: { lat: 47.625, lng: -122.322 },
      ballard: { lat: 47.675, lng: -122.385 },
      queen_anne: { lat: 47.637, lng: -122.357 },
      fremont: { lat: 47.651, lng: -122.350 },
      u_district: { lat: 47.661, lng: -122.313 },
      central_district: { lat: 47.609, lng: -122.302 }
    };
    return coords[id] || { lat: 47.6062, lng: -122.3321 }; // Default to Seattle center
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