import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ChatInterface from '../components/ChatInterface';
import { washingtonMetrics } from '../data/inequalityData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await washingtonMetrics;
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!mapRef.current || isLoading) return;

    const width = 960;
    const height = 500;

    // Clear previous content
    d3.select(mapRef.current).selectAll("*").remove();

    const svg = d3.select(mapRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Custom projection centered on Washington state
    const projection = d3.geoAlbers()
      .center([-120.7, 47.4])
      .rotate([0, 0])
      .scale(4000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load US map data
    Promise.all([
      d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    ]).then(([us]) => {
      if (!us) return;

      const states = feature(us, us.objects.states);
      const washington = states.features.find(d => d.properties?.name === 'Washington');
      
      if (!washington) return;

      // Create tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "absolute hidden bg-black text-white p-2 rounded text-sm")
        .style("pointer-events", "none");

      // Draw Washington state
      svg.append("g")
        .append("path")
        .datum(washington)
        .attr("fill", "#10B981")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .on("mouseover", (event) => {
          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("stroke-width", 2);
          
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html("Washington")
            .classed("hidden", false);
        })
        .on("mouseout", (event) => {
          d3.select(event.currentTarget)
            .attr("opacity", 0.8)
            .attr("stroke-width", 1);
          
          tooltip.classed("hidden", true);
        });
    });

    return () => {
      // Cleanup tooltip
      d3.select("body").selectAll("div.tooltip").remove();
    };
  }, [isLoading]);

  const getQuickStats = () => {
    return {
      gini: washingtonMetrics.find(m => m.id === 'gini')?.currentValue.toFixed(2),
      poverty: washingtonMetrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1),
      wealth: washingtonMetrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1)
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  const stats = getQuickStats();

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