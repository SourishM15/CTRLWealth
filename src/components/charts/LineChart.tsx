import React, { useEffect, useRef } from 'react';
import { TimeSeriesData } from '../../types';

interface LineChartProps {
  title: string;
  data: TimeSeriesData[];
  forecastData?: TimeSeriesData[];
  unit: string;
  domain: [number, number];
  color?: string;
  forecastColor?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  forecastData,
  unit,
  domain,
  color = '#4F46E5',
  forecastColor = '#F59E0B'
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Clear previous content
    chartRef.current.innerHTML = '';

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    // Find the min and max values for x and y axes
    const allData = [...data, ...(forecastData || [])];
    const minYear = Math.min(...allData.map(d => d.year));
    const maxYear = Math.max(...allData.map(d => d.year));
    const maxValue = Math.max(...allData.map(d => d.value));

    // Set up scales
    const xScale = (x: number) => {
      return ((x - minYear) / (maxYear - minYear)) * width;
    };

    const yScale = (y: number) => {
      return height - ((y - domain[0]) / (domain[1] - domain[0])) * height;
    };

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', (width + margin.left + margin.right).toString());
    svg.setAttribute('height', (height + margin.top + margin.bottom).toString());
    svg.style.overflow = 'visible';
    chartRef.current.appendChild(svg);

    // Create group for the chart
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Add x-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xAxis.setAttribute('transform', `translate(0,${height})`);
    g.appendChild(xAxis);

    // X-axis line
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', '0');
    xAxisLine.setAttribute('y1', '0');
    xAxisLine.setAttribute('x2', width.toString());
    xAxisLine.setAttribute('y2', '0');
    xAxisLine.setAttribute('stroke', '#e5e7eb');
    xAxis.appendChild(xAxisLine);

    // X-axis ticks
    const xTicks = 5;
    const xTickStep = Math.ceil((maxYear - minYear) / (xTicks - 1));
    for (let i = 0; i < xTicks; i++) {
      const tickYear = minYear + i * xTickStep;
      const tickX = xScale(tickYear);
      
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', tickX.toString());
      tick.setAttribute('y1', '0');
      tick.setAttribute('x2', tickX.toString());
      tick.setAttribute('y2', '5');
      tick.setAttribute('stroke', '#9ca3af');
      xAxis.appendChild(tick);
      
      const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickLabel.setAttribute('x', tickX.toString());
      tickLabel.setAttribute('y', '20');
      tickLabel.setAttribute('text-anchor', 'middle');
      tickLabel.setAttribute('font-size', '10');
      tickLabel.setAttribute('fill', '#6b7280');
      tickLabel.textContent = tickYear.toString();
      xAxis.appendChild(tickLabel);
    }

    // Add y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(yAxis);

    // Y-axis line
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', '0');
    yAxisLine.setAttribute('y1', '0');
    yAxisLine.setAttribute('x2', '0');
    yAxisLine.setAttribute('y2', height.toString());
    yAxisLine.setAttribute('stroke', '#e5e7eb');
    yAxis.appendChild(yAxisLine);

    // Y-axis ticks
    const yTicks = 5;
    const yTickStep = (domain[1] - domain[0]) / (yTicks - 1);
    for (let i = 0; i < yTicks; i++) {
      const tickValue = domain[0] + i * yTickStep;
      const tickY = yScale(tickValue);
      
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', '0');
      tick.setAttribute('y1', tickY.toString());
      tick.setAttribute('x2', '-5');
      tick.setAttribute('y2', tickY.toString());
      tick.setAttribute('stroke', '#9ca3af');
      yAxis.appendChild(tick);
      
      const tickLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tickLabel.setAttribute('x', '-10');
      tickLabel.setAttribute('y', tickY.toString());
      tickLabel.setAttribute('text-anchor', 'end');
      tickLabel.setAttribute('dominant-baseline', 'middle');
      tickLabel.setAttribute('font-size', '10');
      tickLabel.setAttribute('fill', '#6b7280');
      tickLabel.textContent = tickValue.toFixed(1) + (unit ? unit : '');
      yAxis.appendChild(tickLabel);
      
      // Grid lines
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', '0');
      gridLine.setAttribute('y1', tickY.toString());
      gridLine.setAttribute('x2', width.toString());
      gridLine.setAttribute('y2', tickY.toString());
      gridLine.setAttribute('stroke', '#e5e7eb');
      gridLine.setAttribute('stroke-dasharray', '2,2');
      yAxis.appendChild(gridLine);
    }

    // Draw historical data line
    if (data.length > 1) {
      const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let d = `M ${xScale(data[0].year)} ${yScale(data[0].value)}`;
      
      for (let i = 1; i < data.length; i++) {
        d += ` L ${xScale(data[i].year)} ${yScale(data[i].value)}`;
      }
      
      linePath.setAttribute('d', d);
      linePath.setAttribute('fill', 'none');
      linePath.setAttribute('stroke', color);
      linePath.setAttribute('stroke-width', '2');
      g.appendChild(linePath);
      
      // Add data points
      data.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xScale(point.year).toString());
        circle.setAttribute('cy', yScale(point.value).toString());
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2');
        g.appendChild(circle);
      });
    }

    // Draw forecast data line
    if (forecastData && forecastData.length > 0) {
      // Draw connection line between historical and forecast data
      if (data.length > 0) {
        const connectionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        connectionLine.setAttribute('x1', xScale(data[data.length - 1].year).toString());
        connectionLine.setAttribute('y1', yScale(data[data.length - 1].value).toString());
        connectionLine.setAttribute('x2', xScale(forecastData[0].year).toString());
        connectionLine.setAttribute('y2', yScale(forecastData[0].value).toString());
        connectionLine.setAttribute('stroke', forecastColor);
        connectionLine.setAttribute('stroke-width', '2');
        connectionLine.setAttribute('stroke-dasharray', '4,4');
        g.appendChild(connectionLine);
      }
      
      // Draw forecast line
      if (forecastData.length > 1) {
        const forecastPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = `M ${xScale(forecastData[0].year)} ${yScale(forecastData[0].value)}`;
        
        for (let i = 1; i < forecastData.length; i++) {
          d += ` L ${xScale(forecastData[i].year)} ${yScale(forecastData[i].value)}`;
        }
        
        forecastPath.setAttribute('d', d);
        forecastPath.setAttribute('fill', 'none');
        forecastPath.setAttribute('stroke', forecastColor);
        forecastPath.setAttribute('stroke-width', '2');
        forecastPath.setAttribute('stroke-dasharray', '4,4');
        g.appendChild(forecastPath);
        
        // Add forecast data points
        forecastData.forEach(point => {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', xScale(point.year).toString());
          circle.setAttribute('cy', yScale(point.value).toString());
          circle.setAttribute('r', '3');
          circle.setAttribute('fill', 'white');
          circle.setAttribute('stroke', forecastColor);
          circle.setAttribute('stroke-width', '2');
          g.appendChild(circle);
        });
      }
    }

  }, [data, forecastData, unit, domain, color, forecastColor]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <div ref={chartRef} className="w-full h-[250px]"></div>
      {forecastData && (
        <div className="mt-2 flex items-center">
          <div className="flex items-center mr-4">
            <div className="h-3 w-3 mr-1 bg-indigo-600 rounded-full"></div>
            <span className="text-xs text-gray-600">Historical</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 mr-1 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Forecast</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;