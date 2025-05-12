import React from 'react';
import { FilterState } from '../types';
import { usMetrics, washingtonMetrics } from '../data/inequalityData';

interface AnalysisProps {
  filters: FilterState;
}

const Analysis: React.FC<AnalysisProps> = ({ filters }) => {
  const getAnalysisText = (): { title: string; content: React.ReactNode } => {
    // Default analysis for different views
    if (filters.region === 'us') {
      if (filters.timeframe === 'current') {
        return {
          title: 'Current US Inequality Analysis',
          content: (
            <>
              <p className="mb-3">
                The United States continues to face significant income inequality challenges. The current Gini coefficient of {usMetrics.find(m => m.id === 'gini')?.currentValue.toFixed(2)} indicates high inequality compared to other developed nations.
              </p>
              <p className="mb-3">
                Wealth concentration remains a pressing issue, with the top 1% owning approximately {usMetrics.find(m => m.id === 'wealth-top1')?.currentValue.toFixed(1)}% of the nation's wealth.
              </p>
              <p>
                The income ratio between the top 10% and bottom 50% of earners stands at {usMetrics.find(m => m.id === 'income-ratio')?.currentValue.toFixed(1)}x, highlighting the significant gap between high and low-income households.
              </p>
            </>
          )
        };
      } else if (filters.timeframe === 'historical') {
        return {
          title: 'US Inequality Historical Trends',
          content: (
            <>
              <p className="mb-3">
                Over the past two decades, income inequality in the United States has shown a persistent upward trend. The Gini coefficient has increased by approximately 10% since 2000.
              </p>
              <p className="mb-3">
                Wealth concentration has accelerated more rapidly than income inequality, with the share owned by the top 1% growing substantially.
              </p>
              <p>
                While poverty rates have fluctuated, particularly during economic recessions, the long-term trend shows only marginal improvement despite periods of strong economic growth.
              </p>
            </>
          )
        };
      } else {
        return {
          title: 'US Inequality Forecast',
          content: (
            <>
              <p className="mb-3">
                Forecasts indicate continued challenges with inequality in the United States over the next decade. Without significant policy interventions, the Gini coefficient is projected to increase to approximately {usMetrics.find(m => m.id === 'gini')?.forecastValues[usMetrics.find(m => m.id === 'gini')!.forecastValues.length - 1].value.toFixed(2)} by 2035.
              </p>
              <p className="mb-3">
                Wealth concentration trends suggest the top 1% share could reach {usMetrics.find(m => m.id === 'wealth-top1')?.forecastValues[usMetrics.find(m => m.id === 'wealth-top1')!.forecastValues.length - 1].value.toFixed(1)}% by 2035, representing a significant increase from current levels.
              </p>
              <p>
                On a positive note, poverty rates are projected to decrease modestly, though progress may be uneven across different demographic groups and regions.
              </p>
            </>
          )
        };
      }
    } else if (filters.region === 'washington') {
      if (filters.timeframe === 'current') {
        return {
          title: 'Current Washington State Inequality Analysis',
          content: (
            <>
              <p className="mb-3">
                Washington State shows slightly better inequality metrics than the national average, with a Gini coefficient of {washingtonMetrics.find(m => m.id === 'gini')?.currentValue.toFixed(2)}.
              </p>
              <p className="mb-3">
                The state's robust tech economy has created high-paying jobs, but has also contributed to income disparities, with an income ratio of {washingtonMetrics.find(m => m.id === 'income-ratio')?.currentValue.toFixed(1)}x between top and bottom earners.
              </p>
              <p>
                Washington's poverty rate of {washingtonMetrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1)}% is lower than the national average, reflecting stronger economic opportunities in the state.
              </p>
            </>
          )
        };
      } else if (filters.timeframe === 'historical') {
        return {
          title: 'Washington State Historical Inequality Trends',
          content: (
            <>
              <p className="mb-3">
                Washington State has seen its inequality metrics worsen over time, though at a slower rate than the national average. The rise of the technology sector has created significant wealth, but not all residents have benefited equally.
              </p>
              <p className="mb-3">
                Housing affordability has emerged as a major factor in inequality, particularly in the Seattle metropolitan area, where housing costs have increased dramatically.
              </p>
              <p>
                Despite economic growth, poverty rates have remained stubborn in certain regions of the state, particularly in rural areas and among certain demographic groups.
              </p>
            </>
          )
        };
      } else {
        return {
          title: 'Washington State Inequality Forecast',
          content: (
            <>
              <p className="mb-3">
                Washington State's inequality forecasts suggest a more stable trajectory than the national outlook, with the Gini coefficient projected to remain around {washingtonMetrics.find(m => m.id === 'gini')?.forecastValues[washingtonMetrics.find(m => m.id === 'gini')!.forecastValues.length - 1].value.toFixed(2)} by 2035.
              </p>
              <p className="mb-3">
                The state's proactive policy approaches, including its progressive minimum wage policies, may help temper income inequality growth. However, continued vigilance is needed.
              </p>
              <p>
                Poverty rates are projected to continue their declining trend, potentially reaching {washingtonMetrics.find(m => m.id === 'poverty-rate')?.forecastValues[washingtonMetrics.find(m => m.id === 'poverty-rate')!.forecastValues.length - 1].value.toFixed(1)}% by 2035.
              </p>
            </>
          )
        };
      }
    } else { // Comparison view
      if (filters.timeframe === 'current') {
        return {
          title: 'US vs. Washington State Comparison',
          content: (
            <>
              <p className="mb-3">
                Washington State currently shows moderately better inequality metrics than the US average, with a Gini coefficient {(washingtonMetrics.find(m => m.id === 'gini')!.currentValue - usMetrics.find(m => m.id === 'gini')!.currentValue).toFixed(2)} points lower than the national figure.
              </p>
              <p className="mb-3">
                The poverty rate in Washington ({washingtonMetrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1)}%) compares favorably to the national rate of {usMetrics.find(m => m.id === 'poverty-rate')?.currentValue.toFixed(1)}%, representing a meaningful difference in economic hardship.
              </p>
              <p>
                Wealth concentration patterns, however, are similar between Washington and the national average, highlighting that this is a broader structural challenge.
              </p>
            </>
          )
        };
      } else if (filters.timeframe === 'historical') {
        return {
          title: 'Historical Comparison: US vs. Washington',
          content: (
            <>
              <p className="mb-3">
                Historically, Washington State has maintained better inequality metrics than the US average, though both have shown worsening trends over the past two decades.
              </p>
              <p className="mb-3">
                The gap between Washington and national poverty rates has remained relatively constant, suggesting similar underlying economic forces despite Washington's stronger overall economy.
              </p>
              <p>
                Income ratio trends have been slightly more favorable in Washington compared to national figures, potentially due to stronger wage growth across income levels.
              </p>
            </>
          )
        };
      } else {
        return {
          title: 'Comparative Forecast: US vs. Washington',
          content: (
            <>
              <p className="mb-3">
                Forecasts suggest Washington State will maintain its advantage over national inequality metrics, though the gap may narrow slightly by 2035.
              </p>
              <p className="mb-3">
                The poverty rate differential is expected to persist, with Washington projected to maintain approximately a 2 percentage point advantage over the national average.
              </p>
              <p>
                Both the US and Washington face challenges with wealth concentration, with similar upward trajectories projected unless significant policy interventions are implemented.
              </p>
            </>
          )
        };
      }
    }
  };

  const analysis = getAnalysisText();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{analysis.title}</h3>
      <div className="text-gray-700">
        {analysis.content}
      </div>
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
        <h4 className="font-semibold text-blue-700 mb-1">Policy Implications</h4>
        <p className="text-blue-800 text-sm">
          {filters.timeframe === 'forecast' 
            ? "These projections highlight the need for targeted policy interventions to address systemic inequality. Progressive taxation, educational investments, and affordable housing initiatives could help mitigate these trends."
            : "Current inequality metrics point to the need for structural economic reforms. Policymakers should consider progressive taxation, educational investments, and affordable housing initiatives to address these challenges."}
        </p>
      </div>
    </div>
  );
};

export default Analysis;