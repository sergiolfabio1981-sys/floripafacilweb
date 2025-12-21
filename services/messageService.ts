
import { AppMessage } from '../types';
import { supabase } from './supabase';

export const getMessages = async (): Promise<AppMessage[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
};

export const sendMessage = async (message: Partial<AppMessage>): Promise<void> => {
  const { error } = await supabase.from('messages').insert({
    ...message,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    is_read: false
  });
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);
  
  if (error) console.error('Error marking as read:', error);
};

export const deleteMessage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting message:', error);
};
