
import { GoogleGenAI } from "@google/genai";

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
    // Fix: Using GoogleGenAI according to guidelines, obtaining API_KEY exclusively from process.env
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Fix: Implementing streaming content generation for better UI experience
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Fix: Correctly extracting text from response chunks using the .text property
    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error: any) {
    console.error("Error crítico en Flori AI:", error);
    yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo? 🌊✨";
  }
};
