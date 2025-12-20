
import { CarRental } from '../types';
import { INITIAL_CARS } from '../constants';
import { supabase } from './supabase';

export const getCarRentals = async (): Promise<CarRental[]> => {
  try {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.warn('Error fetching cars from Supabase:', error.message || error);
      return INITIAL_CARS;
    }
    
    if (!data || data.length === 0) {
        return INITIAL_CARS;
    }

    return (data as CarRental[]) || INITIAL_CARS;
  } catch (err: any) {
    console.error('Unexpected error fetching cars:', err?.message || err || 'Unknown Error');
    return INITIAL_CARS;
  }
};

export const getCarById = async (id: string): Promise<CarRental | undefined> => {
  try {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (error) return INITIAL_CARS.find(c => c.id === id);
    return data as CarRental;
  } catch {
    return INITIAL_CARS.find(c => c.id === id);
  }
};

export const saveCarRental = async (car: CarRental): Promise<void> => {
  const carToSave = {
      ...car,
      images: Array.isArray(car.images) ? car.images : []
  };
  const { error } = await supabase.from('cars').upsert(carToSave);
  if (error) console.error('Error saving car:', error);
};

export const deleteCarRental = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) console.error('Error deleting car:', error);
};

export const createEmptyCarRental = (): CarRental => ({
  id: crypto.randomUUID(),
  title: '',
  brand: '',
  category: 'Económico',
  // Use correct property names from CarRental interface in types.ts
  providerPricePerDay: 0,
  profitMarginPerDay: 0,
  description: '',
  images: [`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop`],
  transmission: 'Manual',
  fuel: 'Nafta',
  doors: 4,
  passengers: 5,
  largeSuitcases: 1,
  smallSuitcases: 2,
  hasAC: true,
  location: 'Florianópolis',
  isOffer: false,
  baseCurrency: 'USD',
  type: 'car'
});
