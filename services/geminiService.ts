
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

export const sendMessageToFlori = async function* (message: string) {
  try {
    // Verificamos tanto la forma correcta como el error tipográfico detectado en la captura
    const apiKey = process.env.API_KEY || (process.env as any).API_KEI;
    
    if (!apiKey) {
      yield "¡Olá! Detecto que la clave API no está llegando correctamente. Por favor, asegúrate de que la variable en Vercel se llame exactamente API_KEY (con Y griega). 🌴✨";
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
      const response = chunk as GenerateContentResponse;
      if (response.text) {
        yield response.text;
      }
    }
  } catch (error: any) {
    console.error("Error en Flori AI:", error);
    
    if (error?.message?.includes("API_KEY") || error?.message?.includes("key") || error?.message?.includes("403")) {
      yield "¡Olá! Mi clave de acceso parece no ser válida o no tener permisos. Revisa que sea una clave de Gemini activa en Google AI Studio. 🌊";
    } else {
      yield "¡Olá! Tuve un pequeño contratiempo con mi conexión. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
