
import { Trip } from '../types';
import { INITIAL_TRIPS } from '../constants';
import { supabase } from './supabase';

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*');

    if (error) {
      console.error('Error fetching trips from Supabase:', error);
      // Fallback to initial data if DB fails or is empty initially for demo
      return INITIAL_TRIPS; 
    }

    // AUTO-SEEDING LOGIC FOR TRIPS
    // If DB is empty or has fewer items than our updated list (indicating new packages were added to code), we seed it.
    if (!data || data.length < INITIAL_TRIPS.length) {
        console.log("Seeding Database with New Trips...");
        const { error: seedError } = await supabase.from('trips').upsert(INITIAL_TRIPS);
        if (seedError) console.error("Error seeding trips:", seedError);
        // We return INITIAL_TRIPS here to show the new content immediately even if DB write takes a moment
        return INITIAL_TRIPS; 
    }

    return data as Trip[];
  } catch (err) {
    console.error('Unexpected error fetching trips:', err);
    return INITIAL_TRIPS;
  }
};

export const getTripById = async (id: string): Promise<Trip | undefined> => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
       // Fallback to local search if not in DB (e.g. if using mock data)
       return INITIAL_TRIPS.find(t => t.id === id);
    }
    
    return data as Trip;
  } catch (err) {
    return INITIAL_TRIPS.find(t => t.id === id);
  }
};

export const saveTrip = async (trip: Trip): Promise<void> => {
  // Ensure dates/images are arrays for Supabase text[] column compatibility
  const tripToSave = {
      ...trip,
      images: Array.isArray(trip.images) ? trip.images : [],
      availableDates: Array.isArray(trip.availableDates) ? trip.availableDates : []
  };

  const { error } = await supabase
    .from('trips')
    .upsert(tripToSave);

  if (error) {
    console.error('Error saving trip to Supabase:', error);
    alert('Error guardando en la base de datos. Verifica la consola.');
  }
};

export const deleteTrip = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting trip:', error);
  }
};

export const createEmptyTrip = (): Trip => ({
  id: crypto.randomUUID(), // Use standard UUID for DB
  title: '',
  location: '',
  price: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  isOffer: false,
  availableDates: [],
  discount: 0,
  includesFlight: false,
  rating: 0,
  reviewsCount: 0,
  specialLabel: '',
  durationLabel: '',
  baseCurrency: 'USD',
  type: 'trip'
});
