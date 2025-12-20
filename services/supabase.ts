
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE BASE DE DATOS OPERATIVA ---
const SUPABASE_URL = 'https://vpqfnhagaqwyqbonybrz.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_juy41lYCKUYj-mBBkJPsmg_PDzw15BC'; 

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase Error: Credenciales faltantes.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
