
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
 * Intenta obtener la API KEY de múltiples fuentes para mayor robustez
 */
const getApiKey = (): string | undefined => {
  // 1. Intento estándar solicitado por el sistema
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    // Soporte para el error tipográfico detectado en la captura del usuario
    if ((process.env as any).API_KEI) return (process.env as any).API_KEI;
  }
  
  // 2. Intento vía import.meta (común en Vite/Vercel)
  const metaEnv = (import.meta as any).env;
  if (metaEnv) {
    if (metaEnv.VITE_API_KEY) return metaEnv.VITE_API_KEY;
    if (metaEnv.API_KEY) return metaEnv.API_KEY;
    if (metaEnv.API_KEI) return metaEnv.API_KEI;
  }

  return undefined;
};

export const sendMessageToFlori = async function* (message: string) {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn("Flori AI: No se detectó ninguna API_KEY en el entorno.");
      yield "¡Olá! Sigo sin poder conectar con mi cerebro (API KEY). 🌴\n\nHe detectado que en tu Vercel la variable se llama **API_KEI**. Por favor, cámbiala a **API_KEY** (con Y griega) en Settings -> Environment Variables y haz un **Redeploy** manual. ✨";
      return;
    }

    // Inicializamos la IA con la clave detectada
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
    console.error("Error crítico en Flori AI:", error);
    
    const errorMsg = error?.message || "";
    if (errorMsg.includes("API_KEY") || errorMsg.includes("403") || errorMsg.includes("key")) {
      yield "¡Olá! Mi clave de acceso parece no ser válida. Asegúrate de haber copiado la clave completa desde Google AI Studio y que el nombre en Vercel sea exactamente **API_KEY**. 🌊✨";
    } else {
      yield "¡Olá! Tuve un pequeño problema de conexión con la isla. ¿Podrías intentar escribirme de nuevo? 🌊🌴";
    }
  }
};
