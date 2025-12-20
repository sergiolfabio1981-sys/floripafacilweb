
import { supabase } from './supabase';

export const getTermsAndConditions = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'terms_and_conditions')
      .single();

    if (error) {
      console.warn("Could not fetch terms (might be first run):", error.message);
      return `TÉRMINOS Y CONDICIONES GENERALES - FLORIPA FÁCIL

1. RESERVAS Y PAGOS
Para confirmar la reserva de cualquiera de nuestros servicios (paquetes, hoteles, excursiones), se requiere el pago de una seña o el pago total dependiendo de la proximidad de la fecha de viaje. Los precios están expresados en Pesos Argentinos (ARS).

2. DOCUMENTACIÓN
Es responsabilidad exclusiva del pasajero contar con la documentación personal en regla para viajar (Pasaporte, DNI, Visas, Vacunas, etc).

3. CANCELACIONES
Las políticas de cancelación varían según el proveedor del servicio (aerolínea, hotel). Consultar las condiciones específicas de cada paquete.

4. RESPONSABILIDAD
Floripa Fácil actúa como intermediario entre el cliente y los prestadores de servicios. No se responsabiliza por daños, pérdidas o retrasos ajenos a su control directo.

(Edite este texto desde el Panel de Administrador > Legales)`;
    }
    return data?.value || "";
  } catch (err) {
    console.error(err);
    return "No se pudieron cargar los términos y condiciones.";
  }
};

export const saveTermsAndConditions = async (text: string): Promise<void> => {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: 'terms_and_conditions', value: text });
  
  if (error) {
      console.error("Error saving terms:", error);
      throw error;
  }
};
