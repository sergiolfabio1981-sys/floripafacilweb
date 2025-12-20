
import { Seller } from '../types';
import { supabase } from './supabase';

export const getSellers = async (): Promise<Seller[]> => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching sellers:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
};

export const saveSeller = async (seller: Seller): Promise<void> => {
  const { error } = await supabase
    .from('sellers')
    .upsert(seller);
  
  if (error) {
    console.error('Error saving seller:', error);
    throw error;
  }
};

export const deleteSeller = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('sellers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const createEmptySeller = (): Seller => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  phone: '',
  commissionRate: 40, // Por defecto 40%
  totalSales: 0,
  active: true,
  role: 'seller'
});
