
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN DE SUPABASE ---
// Por favor, reemplaza estas cadenas con las credenciales de tu proyecto Supabase
// Puedes encontrarlas en: Settings -> API
const SUPABASE_URL = 'https://fywghtsrjjniivzrvvuv.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d2dodHNyampuaWl2enJ2dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTM2MDYsImV4cCI6MjA3OTk4OTYwNn0.v-7Qq5rnevXYieZDUGYBmDL9wrOxH0Db8beFPsOkzrU'; 

// Nota: En un entorno de producción real, esto iría en variables de entorno (.env)
// Al ser una demo, debes pegarlas aquí.

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
