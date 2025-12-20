
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
 * Obtiene la API KEY exclusivamente de process.env.API_KEY según las directrices.
 */
export const sendMessageToFlori = async function* (message: string) {
  try {
    // Intentamos acceder a la clave siguiendo estrictamente la directriz de process.env.API_KEY
    // Usamos una verificación segura para evitar que el navegador lance un error de referencia
    const env = typeof process !== 'undefined' ? process.env : (window as any).process?.env || {};
    const apiKey = env.API_KEY;

    if (!apiKey) {
      console.error("Flori AI: API_KEY no encontrada en process.env");
      yield "¡Olá! Mi sistema todavía no detecta la clave de acceso (API_KEY). 🌴\n\n**PASO FINAL NECESARIO:** Ve a tu panel de Vercel, pestaña **'Deployments'**, busca este último despliegue y selecciona **'Redeploy'**. Vercel necesita reconstruir la app para inyectar la clave que guardaste. ✨";
      return;
    }

    // Inicialización siguiendo las reglas: nueva instancia antes de la llamada
    const ai = new GoogleGenAI({ apiKey });
    
    // Llamada al modelo gemini-3-flash-preview
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Extraemos el texto de la propiedad .text (no es un método)
    const text = response.text;
    if (text) {
      yield text;
    } else {
      yield "¡Olá! Recibí tu mensaje pero mi respuesta salió en blanco. ¿Podrías intentar de nuevo? 🌊";
    }
  } catch (error: any) {
    console.error("Error crítico en Flori AI:", error);
    
    const errorMsg = error?.message || "";
    if (errorMsg.includes("API_KEY") || errorMsg.includes("403")) {
      yield "¡Olá! Mi clave de acceso parece ser inválida. Por favor, verifica que la clave de Google AI Studio sea correcta y que el nombre en Vercel sea exactamente **API_KEY**. 🌊";
    } else {
      yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
