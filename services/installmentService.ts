
import { InstallmentTrip } from '../types';
import { INITIAL_INSTALLMENT_TRIPS } from '../constants';
import { supabase } from './supabase';

export const getInstallmentTrips = async (): Promise<InstallmentTrip[]> => {
  try {
    const { data, error } = await supabase.from('installments').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    return (data as InstallmentTrip[]) || [];
  } catch {
    return [];
  }
};

export const getInstallmentTripById = async (id: string): Promise<InstallmentTrip | undefined> => {
  try {
    const { data, error } = await supabase.from('installments').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as InstallmentTrip;
  } catch {
    return undefined;
  }
};

export const saveInstallmentTrip = async (trip: InstallmentTrip): Promise<void> => {
  const tripToSave = {
      ...trip,
      images: Array.isArray(trip.images) ? trip.images : []
  };
  const { error } = await supabase.from('installments').upsert(tripToSave);
  if (error) console.error(error);
};

export const deleteInstallmentTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from('installments').delete().eq('id', id);
  if (error) console.error(error);
};

export const createEmptyInstallmentTrip = (): InstallmentTrip => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  // Use correct property names from InstallmentTrip interface in types.ts
  providerTotalPrice: 0,
  profitMargin: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  departureDate: '2026-01-01',
  isOffer: false,
  type: 'installment',
  discount: 0,
  specialLabel: '',
  baseCurrency: 'USD'
});
