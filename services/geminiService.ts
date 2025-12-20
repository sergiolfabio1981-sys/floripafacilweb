
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `Eres "Flori", la asistente virtual experta de "Floripa Fácil". 
Tu personalidad: Mujer brasileña, carismática, profesional del turismo y muy resolutiva.

Tu misión: 
1. Ayudar a los viajeros a planificar su viaje con "Floripa Fácil" en Florianópolis y el sur de Brasil.
2. Promover traslados VIP, Rent a Car FF y excursiones.
3. Responder de forma breve, amable y con muchos emojis (🌴, ✨, 🌊).

IMPORTANTE: 
- Si el usuario muestra interés real, solicita su nombre y WhatsApp para pasarle con un asesor humano.
- Las reservas se confirman con un 40% de seña.`;

/**
 * Función para enviar mensajes a Flori usando la API de Gemini.
 * Sigue estrictamente las guías de @google/genai.
 */
export const sendMessageToFlori = async function* (message: string) {
  try {
    // La API KEY debe obtenerse exclusivamente de process.env.API_KEY
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("Error: process.env.API_KEY no está definida.");
      yield "¡Olá! Mi sistema no detecta la clave de acceso (API_KEY). 🌴\n\nPor favor, verifica en el panel de Vercel que la variable se llame exactamente **API_KEY** y que hayas realizado un **Redeploy** manual de la aplicación. ✨";
      return;
    }

    // Se crea la instancia justo antes de usarla para asegurar que tome el valor actual
    const ai = new GoogleGenAI({ apiKey });
    
    // Usamos el modelo gemini-3-flash-preview para tareas de chat rápidas
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Extraemos el texto de la respuesta (response.text es una propiedad, no un método)
    const text = response.text;
    if (text) {
      yield text;
    }
  } catch (error: any) {
    console.error("Error crítico en Flori AI:", error);
    
    // Manejo de errores amigable
    if (error?.message?.includes("API_KEY") || error?.message?.includes("403")) {
      yield "¡Olá! Mi clave de acceso parece ser inválida. Por favor, revisa la configuración en Google AI Studio y Vercel. 🌊";
    } else {
      yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
