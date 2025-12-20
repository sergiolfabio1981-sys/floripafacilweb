
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
// URL y KEY pre-configuradas para Floripa Fácil
const SUPABASE_URL = 'https://fywghtsrjjniivzrvvuv.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d2dodHNyampuaWl2enJ2dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTM2MDYsImV4cCI6MjA3OTk4OTYwNn0.v-7Qq5rnevXYieZDUGYBmDL9wrOxH0Db8beFPsOkzrU'; 

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase Error: Faltan credenciales URL o KEY.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Nota: Asegúrate de habilitar el acceso público o RLS correctamente en tu panel de Supabase.
