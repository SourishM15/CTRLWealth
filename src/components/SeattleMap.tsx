import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SeattleNeighborhood } from '../types';

interface SeattleMapProps {
  neighborhoods: SeattleNeighborhood[];
  onNeighborhoodSelect: (neighborhood: SeattleNeighborhood) => void;
}

const SeattleMap: React.FC<SeattleMapProps> = ({ neighborhoods, onNeighborhoodSelect }) => {
  const mapRef = useRef<SVGSVGElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || !neighborhoods.length) return;

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

    // For now, create placeholder rectangles for neighborhoods
    // This should be replaced with actual GeoJSON data for Seattle neighborhoods
    const gridSize = Math.ceil(Math.sqrt(neighborhoods.length));
    const rectWidth = width / gridSize;
    const rectHeight = height / gridSize;

    svg.selectAll("rect")
      .data(neighborhoods)
      .join("rect")
      .attr("x", (d, i) => (i % gridSize) * rectWidth)
      .attr("y", (d, i) => Math.floor(i / gridSize) * rectHeight)
      .attr("width", rectWidth - 2)
      .attr("height", rectHeight - 2)
      .attr("fill", d => d.id === selectedId ? "#10B981" : "#4F46E5")
      .attr("opacity", 0.8)
      .attr("rx", 4)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1);
        
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .html(d.name)
          .classed("hidden", false);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.8);
        
        tooltip.classed("hidden", true);
      })
      .on("click", (event, d) => {
        setSelectedId(d.id);
        onNeighborhoodSelect(d);
      });

    // Add neighborhood labels
    svg.selectAll("text")
      .data(neighborhoods)
      .join("text")
      .attr("x", (d, i) => (i % gridSize) * rectWidth + rectWidth / 2)
      .attr("y", (d, i) => Math.floor(i / gridSize) * rectHeight + rectHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", "white")
      .text(d => d.name.split('/')[0]);

    return () => {
      tooltip.remove();
    };
  }, [neighborhoods, selectedId, onNeighborhoodSelect]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-white">
      <svg ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default SeattleMap;