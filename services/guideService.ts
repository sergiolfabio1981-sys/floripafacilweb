
import { DestinationGuide } from '../types';
import { INITIAL_GUIDES } from '../constants';
import { supabase } from './supabase';

export const getGuides = async (): Promise<DestinationGuide[]> => {
  try {
    const { data, error } = await supabase
      .from('destination_guides')
      .select('*')
      .order('name');
    
    if (error) {
      console.warn('Error fetching guides from Supabase:', error.message);
      return INITIAL_GUIDES;
    }

    // AUTO-SEEDING LOGIC: If DB is empty, seed with examples
    if (!data || data.length === 0) {
        console.log("Seeding Database with Example Guides...");
        const { error: seedError } = await supabase.from('destination_guides').upsert(INITIAL_GUIDES);
        if (seedError) console.error("Error seeding guides:", seedError);
        return INITIAL_GUIDES;
    }

    return data || [];
  } catch (err) {
    return INITIAL_GUIDES;
  }
};

export const getGuideById = async (id: string): Promise<DestinationGuide | null> => {
  try {
    const { data, error } = await supabase
      .from('destination_guides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return INITIAL_GUIDES.find(g => g.id === id) || null;
    }
    return data;
  } catch {
    return INITIAL_GUIDES.find(g => g.id === id) || null;
  }
};

export const saveGuide = async (guide: DestinationGuide): Promise<void> => {
  const { error } = await supabase.from('destination_guides').upsert(guide);
  if (error) throw error;
};

export const deleteGuide = async (id: string): Promise<void> => {
  const { error } = await supabase.from('destination_guides').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyGuide = (): DestinationGuide => ({
  id: crypto.randomUUID(),
  name: '',
  summary: '',
  description: '',
  images: [],
  highlights: [],
  active: true
});
