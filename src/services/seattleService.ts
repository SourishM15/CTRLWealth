import { supabase } from '../lib/supabase';

export interface SeattleNeighborhood {
  id: string;
  name: string;
  type: string;
  demographics?: {
    children_under_18: number;
    working_age_adults_18_64: number;
    older_adults_65_over: number;
    aggregate_age_total: number;
    aggregate_age_male: number;
    aggregate_age_female: number;
    median_age_total: number;
    median_age_male: number;
    median_age_female: number;
  };
}

export async function fetchSeattleNeighborhoods(): Promise<SeattleNeighborhood[]> {
  try {
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('seattle_neighborhoods')
      .select('*')
      .order('name');

    if (neighborhoodsError) throw neighborhoodsError;

    const { data: demographics, error: demographicsError } = await supabase
      .from('seattle_demographics')
      .select('*');

    if (demographicsError) throw demographicsError;

    return neighborhoods.map(neighborhood => ({
      ...neighborhood,
      demographics: demographics.find(d => d.neighborhood_id === neighborhood.id)
    }));
  } catch (error) {
    console.error('Error fetching Seattle neighborhoods:', error);
    throw error;
  }
}

export async function fetchNeighborhoodById(id: string): Promise<SeattleNeighborhood | null> {
  try {
    const { data: neighborhood, error: neighborhoodError } = await supabase
      .from('seattle_neighborhoods')
      .select('*')
      .eq('id', id)
      .single();

    if (neighborhoodError) throw neighborhoodError;

    const { data: demographics, error: demographicsError } = await supabase
      .from('seattle_demographics')
      .select('*')
      .eq('neighborhood_id', id)
      .single();

    if (demographicsError) throw demographicsError;

    return {
      ...neighborhood,
      demographics
    };
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    throw error;
  }
}