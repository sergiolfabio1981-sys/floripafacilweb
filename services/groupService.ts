
import { GroupTrip } from '../types';
import { INITIAL_GROUP_TRIPS } from '../constants';
import { supabase } from './supabase';

export const getGroupTrips = async (): Promise<GroupTrip[]> => {
  try {
    const { data, error } = await supabase.from('group_trips').select('*');
    
    if (error) {
        console.error('Error fetching group trips:', error);
        return [];
    }

    return (data as GroupTrip[]) || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getGroupTripById = async (id: string): Promise<GroupTrip | undefined> => {
  try {
    const { data, error } = await supabase.from('group_trips').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as GroupTrip;
  } catch {
    return undefined;
  }
};

export const saveGroupTrip = async (trip: GroupTrip): Promise<void> => {
  const tripToSave = {
      ...trip,
      images: Array.isArray(trip.images) ? trip.images : [],
      availableDates: Array.isArray(trip.availableDates) ? trip.availableDates : []
  };
  const { error } = await supabase.from('group_trips').upsert(tripToSave);
  if (error) console.error('Error saving group trip:', error);
};

export const deleteGroupTrip = async (id: string): Promise<void> => {
  const { error } = await supabase.from('group_trips').delete().eq('id', id);
  if (error) console.error('Error deleting group trip:', error);
};

export const createEmptyGroupTrip = (): GroupTrip => ({
  id: crypto.randomUUID(),
  title: '',
  location: '',
  price: 0,
  description: '',
  images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
  availableDates: [],
  isOffer: false,
  type: 'group',
  discount: 0,
  baseCurrency: 'USD',
  specialLabel: '',
  durationLabel: ''
});
