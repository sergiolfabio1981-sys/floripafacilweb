
import { CarRental } from '../types';
import { INITIAL_CARS } from '../constants';
import { supabase } from './supabase';

// Fix: Completing the getCarRentals function and adding missing exports
export const getCarRentals = async (): Promise<CarRental[]> => {
  try {
    const { data, error } = await supabase.from('cars').select('*');
    
    if (error) {
      console.warn('Supabase: Table "cars" might not exist yet. Using local data.', error.message);
      return INITIAL_CARS; 
    }
    
    if (!data || data.length === 0) {
        return INITIAL_CARS;
    }
    
    return data.map(c => ({...c, type: 'car'})) as CarRental[];
  } catch (err: any) {
    console.error('Unexpected error in getCarRentals:', err);
    return INITIAL_CARS;
  }
};

// Fix: Adding getCarById for vehicle details page
export const getCarById = async (id: string): Promise<CarRental | undefined> => {
  try {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (error) return INITIAL_CARS.find(c => c.id === id);
    return { ...data, type: 'car' } as CarRental;
  } catch {
    return INITIAL_CARS.find(c => c.id === id);
  }
};

// Fix: Adding saveCarRental for admin panel
export const saveCarRental = async (car: CarRental): Promise<void> => {
  const { error } = await supabase.from('cars').upsert(car);
  if (error) throw error;
};

// Fix: Adding deleteCarRental for admin panel
export const deleteCarRental = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

// Fix: Adding createEmptyCarRental for admin panel
export const createEmptyCarRental = (): CarRental => ({
  id: crypto.randomUUID(),
  title: '',
  brand: '',
  category: 'Económico',
  providerPricePerDay: 0,
  profitMarginPerDay: 0,
  description: '',
  images: [],
  transmission: 'Manual',
  fuel: 'Nafta',
  doors: 4,
  passengers: 5,
  largeSuitcases: 1,
  smallSuitcases: 2,
  hasAC: true,
  location: '',
  isOffer: false,
  baseCurrency: 'USD',
  type: 'car'
});
