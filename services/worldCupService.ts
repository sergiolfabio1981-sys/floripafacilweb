
import { WorldCupTrip } from '../types';
import { INITIAL_WORLDCUP_TRIPS } from '../constants';
import { supabase } from './supabase';

export const getWorldCupTrips = async (): Promise<WorldCupTrip[]> => {
  try {
    const { data, error } = await supabase.from('worldcup').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    return (data as WorldCupTrip[]) || [];
  } catch {
    return [];
  }
};

export const getWorldCupTripById = async (id: string): Promise<WorldCupTrip | undefined> => {
  try {
    const { data, error } = await supabase.from('worldcup').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as WorldCupTrip;
  } catch {
    return undefined;
  }
};

export const saveWorldCupTrip = async (trip: WorldCupTrip): Promise<void> => {
  const tripToSave = {
      ...trip,
      images: Array.isArray(trip.images) ? trip.images : []
  };
  const { error } = await supabase.from('worldcup').upsert(tripToSave);
  if (error) console.error(error);
};

export const deleteWorldCupTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from('worldcup').delete().eq('id', id);
  if (error) console.error(error);
};

export const createEmptyWorldCupTrip = (): WorldCupTrip => ({
  id: crypto.randomUUID(),
  title: '',
  location: 'USA - México - Canadá',
  // Use correct property names from WorldCupTrip interface in types.ts
  providerTotalPrice: 0,
  profitMargin: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  departureDate: '2026-06-10',
  originCountry: 'Salida desde Argentina',
  isOffer: false,
  type: 'worldcup',
  discount: 0,
  baseCurrency: 'USD',
  specialLabel: ''
});
