import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChatInterface from '../components/ChatInterface';
import { seattleNeighborhoods } from '../data/seattleData';
import { seattleGeoJSON } from '../data/seattleGeoJSON';
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

    // Create a projection centered on Seattle
    const projection = d3.geoMercator()
      .center([-122.3321, 47.6062])
      .scale(150000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw neighborhoods
    svg.selectAll("path")
      .data(seattleGeoJSON.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const neighborhood = seattleNeighborhoods.find(n => n.id === d.properties.id);
        return neighborhood?.id === selectedNeighborhood?.id ? "#10B981" : "#4F46E5";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1)
          .attr("stroke-width", 2);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(`
            <div class="font-semibold">${d.properties.name}</div>
            <div class="text-xs">Click for details</div>
          `)
          .classed("hidden", false);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.8)
          .attr("stroke-width", 1);

        tooltip.classed("hidden", true);
      })
      .on("click", (event, d) => {
        const neighborhood = seattleNeighborhoods.find(n => n.id === d.properties.id);
        if (neighborhood) {
          setSelectedNeighborhood(neighborhood);
        }
      });

    // Add neighborhood labels
    svg.selectAll("text")
      .data(seattleGeoJSON.features)
      .join("text")
      .attr("transform", d => `translate(${path.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .attr("font-size", "12px")
      .attr("fill", "#1F2937")
      .attr("stroke", "#fff")
      .attr("stroke-width", "3")
      .attr("stroke-linejoin", "round")
      .attr("paint-order", "stroke")
      .text(d => d.properties.name);

    return () => {
      tooltip.remove();
    };
  }, [selectedNeighborhood]);

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