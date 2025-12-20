import { Apartment } from '../types';
import { INITIAL_RENTALS } from '../constants';
import { supabase } from './supabase';

export const getRentals = async (): Promise<Apartment[]> => {
  try {
    const { data, error } = await supabase.from('rentals').select('*');
    if (error) {
      console.warn('Supabase: Table "rentals" might not exist yet.', error.message);
      return INITIAL_RENTALS;
    }

    return (data as Apartment[]).map(r => ({
        ...r,
        images: r.images || [],
        amenities: r.amenities || [],
        type: 'rental'
    }));
  } catch (err) {
    return INITIAL_RENTALS;
  }
};

export const getRentalById = async (id: string): Promise<Apartment | undefined> => {
  try {
    const { data, error } = await supabase.from('rentals').select('*').eq('id', id).single();
    if (error) return undefined;
    return { ...data, type: 'rental' } as Apartment;
  } catch {
    return undefined;
  }
};

export const saveRental = async (rental: Apartment): Promise<void> => {
  const { error } = await supabase.from('rentals').upsert(rental);
  if (error) throw error;
};

export const deleteRental = async (id: string): Promise<void> => {
  const { error } = await supabase.from('rentals').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyRental = (): Apartment => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPricePerNight: 0,
  profitMarginPerNight: 0,
  description: '',
  images: [],
  bedrooms: 1,
  maxGuests: 2,
  amenities: [],
  isOffer: false,
  baseCurrency: 'USD',
  type: 'rental'
});