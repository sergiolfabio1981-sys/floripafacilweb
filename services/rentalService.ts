
import { Apartment } from '../types';
import { INITIAL_RENTALS } from '../constants';
import { supabase } from './supabase';

export const getRentals = async (): Promise<Apartment[]> => {
  try {
    const { data, error } = await supabase.from('rentals').select('*');
    if (error) {
      console.error('Error fetching rentals:', error);
      return [];
    }

    return (data as Apartment[]).map(r => ({
        ...r,
        images: r.images || [],
        amenities: r.amenities || [],
        type: 'rental'
    }));
  } catch (err) {
    return [];
  }
};

export const getRentalById = async (id: string): Promise<Apartment | undefined> => {
  try {
    const { data, error } = await supabase.from('rentals').select('*').eq('id', id).single();
    if (error) return undefined;
    const rental = data as Apartment;
    return {
        ...rental,
        images: rental.images || [],
        amenities: rental.amenities || [],
        type: 'rental'
    };
  } catch {
    return undefined;
  }
};

export const saveRental = async (rental: Apartment): Promise<void> => {
  const rentalToSave = {
      ...rental,
      images: Array.isArray(rental.images) ? rental.images : [],
      amenities: Array.isArray(rental.amenities) ? rental.amenities : [],
      type: 'rental'
  };
  const { error } = await supabase.from('rentals').upsert(rentalToSave);
  if (error) {
      console.error('Error saving rental:', error);
      throw error;
  }
};

export const deleteRental = async (id: string): Promise<void> => {
  const { error } = await supabase.from('rentals').delete().eq('id', id);
  if (error) console.error('Error deleting rental:', error);
};

export const createEmptyRental = (): Apartment => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPricePerNight: 0,
  profitMarginPerNight: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  bedrooms: 1,
  maxGuests: 2,
  amenities: [],
  isOffer: false,
  lat: undefined,
  lng: undefined,
  discount: 0,
  specialLabel: '',
  baseCurrency: 'USD',
  type: 'rental'
});
