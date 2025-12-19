
import { Excursion } from '../types';
import { INITIAL_EXCURSIONS } from '../constants';
import { supabase } from './supabase';

export const getExcursions = async (): Promise<Excursion[]> => {
  try {
    const { data, error } = await supabase.from('excursions').select('*');
    if (error) {
      console.error('Error fetching excursions:', error);
      return INITIAL_EXCURSIONS;
    }

    // AUTO-SEEDING LOGIC FOR EXCURSIONS
    // If DB is empty or has significantly fewer items than our updated constants (indicating missing new data), seed it.
    if (!data || data.length < INITIAL_EXCURSIONS.length) {
        console.log("Seeding Database with New Excursions...");
        const { error: seedError } = await supabase.from('excursions').upsert(INITIAL_EXCURSIONS);
        if (seedError) console.error("Error seeding excursions:", seedError);
        // Return local data immediately to show update
        return INITIAL_EXCURSIONS;
    }

    return (data as Excursion[]) || INITIAL_EXCURSIONS;
  } catch (err) {
    return INITIAL_EXCURSIONS;
  }
};

export const getExcursionById = async (id: string): Promise<Excursion | undefined> => {
  try {
    const { data, error } = await supabase.from('excursions').select('*').eq('id', id).single();
    if (error) return INITIAL_EXCURSIONS.find(e => e.id === id);
    return data as Excursion;
  } catch {
    return INITIAL_EXCURSIONS.find(e => e.id === id);
  }
};

export const saveExcursion = async (excursion: Excursion): Promise<void> => {
  const excursionToSave = {
      ...excursion,
      images: Array.isArray(excursion.images) ? excursion.images : [],
      availableDates: Array.isArray(excursion.availableDates) ? excursion.availableDates : []
  };
  const { error } = await supabase.from('excursions').upsert(excursionToSave);
  if (error) console.error('Error saving excursion:', error);
};

export const deleteExcursion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('excursions').delete().eq('id', id);
  if (error) console.error('Error deleting excursion:', error);
};

export const createEmptyExcursion = (): Excursion => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  price: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  isOffer: false,
  duration: '',
  availableDates: [],
  type: 'excursion',
  discount: 0,
  specialLabel: '',
  baseCurrency: 'USD'
});
