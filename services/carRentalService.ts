
import { CarRental } from '../types';
import { INITIAL_CARS } from '../constants';
import { supabase } from './supabase';

const getSanitizedPayload = (car: any) => {
    return {
        id: car.id,
        title: car.title,
        brand: car.brand || '',
        category: car.category || 'Económico',
        providerPricePerDay: car.providerPricePerDay || 0,
        profitMarginPerDay: car.profitMarginPerDay || 0,
        description: car.description || '',
        images: Array.isArray(car.images) ? car.images : [],
        transmission: car.transmission || 'Manual',
        fuel: car.fuel || 'Nafta',
        doors: car.doors || 4,
        passengers: car.passengers || 5,
        largeSuitcases: car.largeSuitcases || 1,
        smallSuitcases: car.smallSuitcases || 2,
        hasAC: !!car.hasAC,
        location: car.location || '',
        isOffer: !!car.isOffer,
        baseCurrency: car.baseCurrency || 'USD'
    };
};

export const getCarRentals = async (): Promise<CarRental[]> => {
  try {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
      console.warn('Supabase: Table "cars" might not exist yet. Using local data.', error.message);
      return INITIAL_CARS; 
    }
    if (!data || data.length === 0) return INITIAL_CARS;
    return data.map(c => ({...c, type: 'car'})) as CarRental[];
  } catch (err: any) {
    return INITIAL_CARS;
  }
};

export const getCarById = async (id: string): Promise<CarRental | undefined> => {
  try {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (error) return INITIAL_CARS.find(c => c.id === id);
    return { ...data, type: 'car' } as CarRental;
  } catch {
    return INITIAL_CARS.find(c => c.id === id);
  }
};

export const saveCarRental = async (car: CarRental): Promise<void> => {
  const payload = getSanitizedPayload(car);
  const { error } = await supabase.from('cars').upsert(payload);
  if (error) throw error;
};

export const deleteCarRental = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
};

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
