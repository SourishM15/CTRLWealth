import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ChatInterface from '../components/ChatInterface';
import { seattleNeighborhoods } from '../data/seattleData';
import { seattleGeoJSON } from '../data/seattleGeoJSON';

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

    // Create projection centered on Seattle
    const projection = d3.geoMercator()
      .center([-122.3321, 47.6062])
      .scale(150000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#B8D5F0"); // Light blue for water

    // Draw Seattle neighborhoods
    svg.selectAll("path")
      .data(seattleGeoJSON.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => d.properties.id === selectedNeighborhood ? "#10B981" : "#E5E7EB")
      .attr("stroke", "#4B5563")
      .attr("stroke-width", 1)
      .attr("opacity", 0.9)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1)
          .attr("stroke-width", 2);

        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(d.properties.name)
          .classed("hidden", false);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.9)
          .attr("stroke-width", 1);

        tooltip.classed("hidden", true);
      })
      .on("click", (event, d) => {
        setSelectedNeighborhood(d.properties.id);
      });

    // Add neighborhood labels
    svg.selectAll("text")
      .data(seattleGeoJSON.features)
      .enter()
      .append("text")
      .attr("transform", d => {
        const centroid = path.centroid(d);
        return `translate(${centroid[0]},${centroid[1]})`;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#1F2937")
      .attr("font-weight", "500")
      .text(d => d.properties.name);

    // Add major highways
    const highways = [
      { id: "I-5", coordinates: [[-122.3321, 47.5500], [-122.3321, 47.6500]] },
      { id: "I-90", coordinates: [[-122.4000, 47.6062], [-122.2800, 47.6062]] }
    ];

    highways.forEach(highway => {
      svg.append("path")
        .datum({
          type: "LineString",
          coordinates: highway.coordinates
        })
        .attr("d", path)
        .attr("stroke", "#DC2626")
        .attr("stroke-width", 3)
        .attr("fill", "none");
    });

    return () => {
      tooltip.remove();
    };
  }, [selectedNeighborhood]);

  const selectedData = selectedNeighborhood 
    ? seattleNeighborhoods.find(n => n.id === selectedNeighborhood)
    : null;

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
                  {selectedData ? (
                    (selectedData.demographics.children_under_18 + 
                    selectedData.demographics.working_age_adults_18_64 + 
                    selectedData.demographics.older_adults_65_over).toLocaleString()
                  ) : "Select a neighborhood"}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-800">Children Under 18</h3>
                <p className="text-2xl font-bold text-emerald-600">
                  {selectedData ? selectedData.demographics.children_under_18.toLocaleString() : "-"}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800">Median Age</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {selectedData ? selectedData.demographics.median_age_total : "-"}
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