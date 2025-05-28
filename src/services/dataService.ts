import { supabase } from '../lib/supabase';
import { InequalityMetric, TimeSeriesData, RegionData } from '../types';

export async function fetchRegions(): Promise<RegionData[]> {
  const { data: regions, error } = await supabase
    .from('regions')
    .select('*');

  if (error) throw error;

  const { data: metrics, error: metricsError } = await supabase
    .from('metrics')
    .select('*');

  if (metricsError) throw metricsError;

  const { data: values, error: valuesError } = await supabase
    .from('metric_values')
    .select('*');

  if (valuesError) throw valuesError;

  return regions.map(region => ({
    id: region.id,
    name: region.name,
    metrics: metrics.map(metric => {
      const metricValues = values.filter(v => 
        v.region_id === region.id && 
        v.metric_id === metric.id
      );

      return {
        id: metric.id,
        name: metric.name,
        description: metric.description,
        unit: metric.unit,
        domain: [metric.domain_min, metric.domain_max] as [number, number],
        currentValue: metricValues.find(v => v.year === 2023)?.value || 0,
        historicalValues: metricValues
          .filter(v => !v.is_forecast)
          .map(v => ({
            year: v.year,
            value: v.value
          })),
        forecastValues: metricValues
          .filter(v => v.is_forecast)
          .map(v => ({
            year: v.year,
            value: v.value
          }))
      };
    })
  }));
}

export async function fetchMetricValues(
  regionId: string,
  metricId: string,
  startYear: number,
  endYear: number
): Promise<TimeSeriesData[]> {
  const { data, error } = await supabase
    .from('metric_values')
    .select('*')
    .eq('region_id', regionId)
    .eq('metric_id', metricId)
    .gte('year', startYear)
    .lte('year', endYear)
    .order('year');

  if (error) throw error;

  return data.map(d => ({
    year: d.year,
    value: d.value
  }));
}