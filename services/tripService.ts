import { Trip } from '../types';
import { INITIAL_TRIPS } from '../constants';
import { supabase } from './supabase';

const getSanitizedPayload = (trip: any) => {
    return {
        id: trip.id,
        title: trip.title,
        location: trip.location,
        providerPrice: trip.providerPrice,
        profitMargin: trip.profitMargin,
        description: trip.description,
        images: Array.isArray(trip.images) ? trip.images : [],
        isOffer: !!trip.isOffer,
        availableDates: Array.isArray(trip.availableDates) ? trip.availableDates : [],
        baseCurrency: trip.baseCurrency || 'USD',
        specialLabel: trip.specialLabel || '',
        durationLabel: trip.durationLabel || '',
        highlights: Array.isArray(trip.highlights) ? trip.highlights : [],
        included: Array.isArray(trip.included) ? trip.included : [],
        notIncluded: Array.isArray(trip.notIncluded) ? trip.notIncluded : [],
        meetingPoint: trip.meetingPoint || '',
        importantInfo: trip.importantInfo || '',
        cancellationPolicy: trip.cancellationPolicy || ''
    };
};

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase.from('trips').select('*');
    
    if (error) {
      console.warn('Supabase: Table "trips" might not exist yet. Using local data.', error.message);
      return INITIAL_TRIPS; 
    }
    
    if (!data || data.length === 0) {
        return INITIAL_TRIPS;
    }
    
    return data.map(t => ({...t, type: 'trip'})) as Trip[];
  } catch (err: any) {
    console.error('Unexpected error in getTrips:', err);
    return INITIAL_TRIPS;
  }
};

export const getTripById = async (id: string): Promise<Trip | undefined> => {
  try {
    const { data, error } = await supabase.from('trips').select('*').eq('id', id).single();
    if (error) return INITIAL_TRIPS.find(t => t.id === id);
    return {...data, type: 'trip'} as Trip;
  } catch {
    return INITIAL_TRIPS.find(t => t.id === id);
  }
};

export const saveTrip = async (trip: any): Promise<void> => {
  const payload = getSanitizedPayload(trip);
  const { error } = await supabase.from('trips').upsert(payload);
  if (error) throw error;
};

export const deleteTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyTrip = (): Trip => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  providerPrice: 0,
  profitMargin: 0,
  description: '',
  images: [],
  isOffer: false,
  availableDates: [],
  baseCurrency: 'USD',
  type: 'trip',
  highlights: [],
  included: [],
  notIncluded: [],
  meetingPoint: '',
  importantInfo: ''
});