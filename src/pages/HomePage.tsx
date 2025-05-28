import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChatInterface from '../components/ChatInterface';
import { seattleNeighborhoods } from '../data/seattleData';

const HomePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

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

    // Seattle boundary coordinates
    const seattleBoundary = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [-122.50430755793437, 47.70540114711574],
            [-122.50558917574187, 47.6258565022606],
            [-122.50291266215622, 47.57810015565403],
            [-122.5035985106469, 47.48380675619535],
            [-122.21418815398167, 47.48382100110544],
            [-122.22442872411892, 47.70476795186832],
            [-122.50430755793437, 47.70540114711574]
          ]
        ],
        "type": "Polygon"
      }
    };

    // Define neighborhood coordinates
    const neighborhoods = [
      { name: "Ballard", coords: [-122.3866, 47.6792] },
      { name: "Fremont", coords: [-122.3499, 47.6615] },
      { name: "Queen Anne", coords: [-122.3566, 47.6348] },
      { name: "Capitol Hill", coords: [-122.3222, 47.6253] },
      { name: "U-District", coords: [-122.3132, 47.6615] },
      { name: "Central District", coords: [-122.3027, 47.6088] }
    ];

    // Create projection centered on Seattle
    const projection = d3.geoMercator()
      .center([-122.3321, 47.6062])
      .scale(100000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw Seattle boundary
    svg.append("path")
      .datum(seattleBoundary)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#4F46E5")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6);

    // Add neighborhood circles
    const circles = svg.selectAll("circle")
      .data(neighborhoods)
      .enter()
      .append("circle")
      .attr("cx", d => projection(d.coords)![0])
      .attr("cy", d => projection(d.coords)![1])
      .attr("r", 10)
      .attr("fill", "#10B981")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1)
          .attr("r", 12);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(d.name)
          .classed("hidden", false);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.8)
          .attr("r", 10);

        tooltip.classed("hidden", true);
      })
      .on("click", (event, d) => {
        setSelectedNeighborhood(d.name.toLowerCase().replace(" ", "_"));
      });

    // Add neighborhood labels
    svg.selectAll("text")
      .data(neighborhoods)
      .enter()
      .append("text")
      .attr("x", d => projection(d.coords)![0])
      .attr("y", d => projection(d.coords)![1] + 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#1f2937")
      .text(d => d.name);

    return () => {
      tooltip.remove();
    };
  }, []);

  const selectedData = selectedNeighborhood 
    ? seattleNeighborhoods.find(n => n.id === selectedNeighborhood)
    : seattleNeighborhoods[0];

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
                  {(selectedData.demographics.children_under_18 + 
                    selectedData.demographics.working_age_adults_18_64 + 
                    selectedData.demographics.older_adults_65_over).toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-800">Children Under 18</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {selectedData.demographics.children_under_18.toLocaleString()}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800">Median Age</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {selectedData.demographics.median_age_total}
                </p>
              </div>
            </div>

            <div className="w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
              <svg ref={mapRef} className="w-full h-full" />
            </div>

            {selectedData && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedData.name} Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Working Age Adults:</strong> {selectedData.demographics.working_age_adults_18_64.toLocaleString()}</p>
                    <p><strong>Older Adults (65+):</strong> {selectedData.demographics.older_adults_65_over.toLocaleString()}</p>
                  </div>
                  <div>
                    <p><strong>Median Age (Male):</strong> {selectedData.demographics.median_age_male}</p>
                    <p><strong>Median Age (Female):</strong> {selectedData.demographics.median_age_female}</p>
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