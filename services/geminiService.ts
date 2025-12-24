
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
    // Inicialización inmediata con la clave de entorno
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview', // Cambiamos a Pro para mayor capacidad de razonamiento
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error: any) {
    console.error("Error en la conexión con Flori AI:", error);
    
    // Si el error es de autenticación o cuota, damos un mensaje amigable
    if (error.message?.includes('API_KEY')) {
        yield "¡Olá! Mi conexión con la base central está en mantenimiento momentáneo. Por favor, contacta a nuestros asesores por WhatsApp para una atención inmediata. 🌊✨";
    } else {
        yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
