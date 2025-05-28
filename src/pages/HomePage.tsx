import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ChatInterface from '../components/ChatInterface';
import { usMetrics, washingtonMetrics } from '../data/inequalityData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedState, setSelectedState] = useState<'US' | 'WA'>('WA');

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

    // Create a projection centered on Washington state
    const projection = d3.geoAlbers()
      .center([-120.7401, 47.7511]) // Center coordinates for Washington
      .rotate([0, 0])
      .scale(5000) // Increased scale to zoom in more
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load US map data
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then((us: any) => {
        if (!us) return;

        const states = feature(us, us.objects.states);
        
        // Draw states
        svg.append("g")
          .selectAll("path")
          .data(states.features)
          .join("path")
          .attr("fill", d => {
            // Only highlight Washington state
            const stateName = d.properties?.name;
            return stateName === 'Washington' ? '#4F46E5' : '#e5e7eb';
          })
          .attr("d", path)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .attr("opacity", d => {
            const stateName = d.properties?.name;
            return stateName === 'Washington' ? 0.8 : 0.3;
          })
          .on("mouseover", (event, d: any) => {
            const stateName = d.properties?.name;
            if (stateName === 'Washington') {
              d3.select(event.currentTarget)
                .attr("opacity", 1)
                .attr("stroke-width", 1.5);
              
              tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px")
                .html(`
                  <div class="font-semibold">Washington State</div>
                  <div class="text-xs">Click for details</div>
                `)
                .classed("hidden", false);
            }
          })
          .on("mouseout", (event, d: any) => {
            const stateName = d.properties?.name;
            if (stateName === 'Washington') {
              d3.select(event.currentTarget)
                .attr("opacity", 0.8)
                .attr("stroke-width", 0.5);
              
              tooltip.classed("hidden", true);
            }
          })
          .on("click", (event, d: any) => {
            const stateName = d.properties?.name;
            if (stateName === 'Washington') {
              setSelectedState('WA');
            }
          });

        // Add major cities in Washington
        const cities = [
          { name: "Seattle", coordinates: [-122.3321, 47.6062] },
          { name: "Spokane", coordinates: [-117.4260, 47.6588] },
          { name: "Tacoma", coordinates: [-122.4400, 47.2529] },
          { name: "Vancouver", coordinates: [-122.6615, 45.6387] },
          { name: "Bellevue", coordinates: [-122.2006, 47.6101] }
        ];

        // Add city markers
        svg.selectAll("circle")
          .data(cities)
          .join("circle")
          .attr("transform", d => `translate(${projection(d.coordinates)})`)
          .attr("r", 4)
          .attr("fill", "#ef4444")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        // Add city labels
        svg.selectAll("text")
          .data(cities)
          .join("text")
          .attr("transform", d => `translate(${projection(d.coordinates)})`)
          .attr("dx", "8")
          .attr("dy", "4")
          .attr("font-size", "12px")
          .attr("fill", "#1f2937")
          .text(d => d.name);
      })
      .catch(error => {
        console.error('Error loading map data:', error);
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
              Washington State Inequality Overview
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
            <div className="w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
              <svg ref={mapRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;