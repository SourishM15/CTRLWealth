import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChatInterface from '../components/ChatInterface';
import { usMetrics, washingtonMetrics } from '../data/inequalityData';

// Washington state GeoJSON data
const washingtonCoordinates = {
  "type": "Feature",
  "properties": {
    "name": "Washington",
    "abbreviation": "WA"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-124.79, 48.85],
      [-123.89, 48.85],
      [-123.09, 48.85],
      [-123.09, 49.00],
      [-117.03, 49.00],
      [-117.03, 46.00],
      [-117.03, 45.93],
      [-116.92, 45.93],
      [-116.92, 45.85],
      [-124.79, 45.85],
      [-124.79, 48.85]
    ]]
  }
};

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedState, setSelectedState] = useState<'US' | 'WA'>('US');

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 960;
    const height = 500;

    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Create a projection specifically for Washington state
    const projection = d3.geoAlbers()
      .center([-120.7, 47.4])
      .rotate([0, 0])
      .scale(3500)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-black text-white p-2 rounded text-sm")
      .style("pointer-events", "none");

    // Draw Washington state
    svg.selectAll("path")
      .data([washingtonCoordinates])
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#4F46E5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1);
        
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html("Washington State")
          .classed("hidden", false);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.8);
        
        tooltip.classed("hidden", true);
      })
      .on("click", () => {
        setSelectedState(selectedState === 'WA' ? 'US' : 'WA');
      });

    return () => {
      tooltip.remove();
    };
  }, [selectedState]);

  const metrics = selectedState === 'WA' ? washingtonMetrics : usMetrics;
  const stats = {
    gini: metrics.find(m => m.id === 'gini')?.currentValue.toFixed(2),
    poverty: metrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1),
    wealth: metrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1)
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
              {selectedState === 'WA' ? 'Washington State' : 'United States'} Inequality Overview
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-800">Gini Coefficient</h3>
                <p className="text-2xl font-bold text-indigo-600">{stats.gini}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-800">Poverty Rate</h3>
                <p className="text-2xl font-bold text-emerald-600">{stats.poverty}%</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800">Top 1% Wealth Share</h3>
                <p className="text-2xl font-bold text-amber-600">{stats.wealth}%</p>
              </div>
            </div>
            <div className="w-full h-[500px] rounded-lg overflow-hidden">
              <svg ref={mapRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;