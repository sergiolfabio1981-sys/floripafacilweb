
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Eres "Flori", la asistente virtual experta de "Floripa Fácil". 
Tu personalidad: Mujer brasileña, carismática, profesional del turismo y muy resolutiva.

Tu misión: 
1. Ayudar a los viajeros a planificar su viaje con "Floripa Fácil" en Florianópolis y el sur de Brasil.
2. Promover traslados VIP, Rent a Car FF y excursiones de la agencia.
3. Responder de forma breve, amable y con muchos emojis (🌴, ✨, 🌊).

REGLAS CRÍTICAS:
- Las reservas se confirman con un 40% de seña para congelar el precio en ARS o USD.
- Si el usuario quiere reservar o pide precios específicos que no conoces, solicita su nombre y WhatsApp amablemente para que un asesor lo contacte.
- No menciones nunca a "ABRAS Travel", solo a "Floripa Fácil".`;

export const sendMessageToFlori = async function* (message: string) {
  try {
    // Verificamos si la API KEY está disponible
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview', // Modelo Flash: más rápido y compatible
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error: any) {
    console.error("Error en Flori AI:", error.message);
    
    if (error.message === "API_KEY_MISSING" || error.message?.includes('API_KEY') || error.message?.includes('403')) {
        yield "¡Olá! Necesito una conexión activa para ayudarte. Por favor, haz clic en el botón 'Vincular' que aparecerá aquí arriba para activar mis servicios. 🌴✨";
    } else if (error.message?.includes('Requested entity was not found')) {
        yield "¡Ups! Parece que mi conexión expiró. Por favor, intenta vincular de nuevo tu acceso. 🌊";
    } else {
        yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo en unos segundos? 🌊✨";
    }
  }
};
