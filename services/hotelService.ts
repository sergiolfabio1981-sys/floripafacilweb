
import { Hotel } from '../types';
import { INITIAL_HOTELS } from '../constants';
import { supabase } from './supabase';

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const { data, error } = await supabase.from('hotels').select('*');
    if (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }

    return (data as Hotel[]).map(h => ({
        ...h,
        images: h.images || [],
        amenities: h.amenities || [],
        type: 'hotel'
    }));
  } catch (err) {
    return [];
  }
};

export const getHotelById = async (id: string): Promise<Hotel | undefined> => {
  try {
    const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single();
    if (error) return undefined;
    const hotel = data as Hotel;
    return {
        ...hotel,
        images: hotel.images || [],
        amenities: hotel.amenities || [],
        type: 'hotel'
    };
  } catch {
    return undefined;
  }
};

export const saveHotel = async (hotel: Hotel): Promise<void> => {
  const hotelToSave = {
      ...hotel,
      images: Array.isArray(hotel.images) ? hotel.images : [],
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
      type: 'hotel'
  };
  const { error } = await supabase.from('hotels').upsert(hotelToSave);
  if (error) {
      console.error('Error saving hotel:', error);
      throw error; 
  }
};

export const deleteHotel = async (id: string): Promise<void> => {
  const { error } = await supabase.from('hotels').delete().eq('id', id);
  if (error) console.error('Error deleting hotel:', error);
};

export const createEmptyHotel = (): Hotel => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPricePerNight: 0,
  profitMarginPerNight: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  stars: 3,
  amenities: [],
  isOffer: false,
  lat: undefined,
  lng: undefined,
  type: 'hotel',
  discount: 0,
  specialLabel: '',
  baseCurrency: 'USD'
});
