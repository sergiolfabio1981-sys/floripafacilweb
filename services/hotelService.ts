import { Hotel } from '../types';
import { INITIAL_HOTELS } from '../constants';
import { supabase } from './supabase';

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const { data, error } = await supabase.from('hotels').select('*');
    if (error) {
      console.warn('Supabase: Table "hotels" might not exist yet.', error.message);
      return INITIAL_HOTELS;
    }

    return (data as Hotel[]).map(h => ({
        ...h,
        images: h.images || [],
        amenities: h.amenities || [],
        type: 'hotel'
    }));
  } catch (err) {
    return INITIAL_HOTELS;
  }
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
  try {
    const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single();
    if (error) return undefined;
    return { ...data, type: 'hotel' } as Hotel;
  } catch {
    return undefined;
  }
};

export const saveHotel = async (hotel: Hotel): Promise<void> => {
  const { error } = await supabase.from('hotels').upsert(hotel);
  if (error) throw error; 
};

export const deleteHotel = async (id: string): Promise<void> => {
  const { error } = await supabase.from('hotels').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyHotel = (): Hotel => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPricePerNight: 0,
  profitMarginPerNight: 0,
  description: '',
  images: [],
  stars: 3,
  amenities: [],
  isOffer: false,
  type: 'hotel',
  baseCurrency: 'USD'
});