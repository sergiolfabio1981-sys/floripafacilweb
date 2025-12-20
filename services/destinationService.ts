
import { Destination } from '../types';
import { supabase } from './supabase';

export const getDestinations = async (): Promise<Destination[]> => {
  const { data, error } = await supabase.from('destinations').select('*').order('name');
  if (error || !data || data.length === 0) {
    return [
      { id: '1', name: 'Florianópolis', active: true },
      { id: '2', name: 'Bombinhas', active: true },
      { id: '3', name: 'Camboriú', active: true }
    ];
  }
  return data;
};

export const saveDestination = async (destination: Destination): Promise<void> => {
  const { error } = await supabase.from('destinations').upsert({
      id: destination.id,
      name: destination.name,
      active: destination.active
  });
  if (error) throw error;
};

export const deleteDestination = async (id: string): Promise<void> => {
  const { error } = await supabase.from('destinations').delete().eq('id', id);
  if (error) throw error;
};

export const createEmptyDestination = (): Destination => ({
  id: crypto.randomUUID(),
  name: '',
  active: true
});
