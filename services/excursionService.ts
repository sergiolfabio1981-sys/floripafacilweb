import { Excursion } from '../types';
import { INITIAL_EXCURSIONS } from '../constants';
import { supabase } from './supabase';

export const getExcursions = async (): Promise<Excursion[]> => {
  try {
    const { data, error } = await supabase.from('excursions').select('*');
    if (error) {
      console.warn('Supabase: Table "excursions" might not exist yet. Using local data.', error.message);
      return INITIAL_EXCURSIONS;
    }

    if (!data || data.length === 0) {
        return INITIAL_EXCURSIONS;
    }

    return (data as Excursion[]).map(e => ({...e, type: 'excursion'})) || INITIAL_EXCURSIONS;
  } catch (err) {
    return INITIAL_EXCURSIONS;
  }
};

export const getExcursionById = async (id: string): Promise<Excursion | undefined> => {
  try {
    const { data, error } = await supabase.from('excursions').select('*').eq('id', id).single();
    if (error) return INITIAL_EXCURSIONS.find(e => e.id === id);
    return {...data, type: 'excursion'} as Excursion;
  } catch {
    return INITIAL_EXCURSIONS.find(e => e.id === id);
  }
};

export const saveExcursion = async (excursion: Excursion): Promise<void> => {
  const { error } = await supabase.from('excursions').upsert(excursion);
  if (error) throw error;
};

export const deleteExcursion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('excursions').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyExcursion = (): Excursion => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPrice: 0,
  profitMargin: 0,
  description: '',
  images: [],
  isOffer: false,
  duration: '',
  availableDates: [],
  type: 'excursion',
  baseCurrency: 'USD'
});