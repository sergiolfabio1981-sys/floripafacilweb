
import { CarRental } from '../types';
import { supabase } from './supabase';

export const getCarRentals = async (): Promise<CarRental[]> => {
  try {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
    return (data as CarRental[]) || [];
  } catch (err) {
    return [];
  }
};

export const getCarById = async (id: string): Promise<CarRental | undefined> => {
  try {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as CarRental;
  } catch {
    return undefined;
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
  pricePerDay: 0,
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
