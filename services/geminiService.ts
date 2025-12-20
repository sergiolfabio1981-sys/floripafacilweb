
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
 * Función ultra-robusta para capturar la API KEY en cualquier entorno
 */
const getApiKey = (): string | undefined => {
  // 1. Intentar desde process.env (estándar de Node/Vercel)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    if ((process.env as any).API_KEI) return (process.env as any).API_KEI;
    if ((process.env as any).VITE_API_KEY) return (process.env as any).VITE_API_KEY;
  }
  
  // 2. Intentar desde import.meta (estándar de Vite)
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
    
    // Log de diagnóstico para el desarrollador (Visible en F12)
    console.log("Flori AI Debug:", {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      envType: typeof process !== 'undefined' ? 'Node/Process' : 'Browser/Vite'
    });

    if (!apiKey) {
      yield "¡Olá! Sigo sin poder acceder a mi clave de acceso. 🌴\n\n**IMPORTANTE:** Después de crear la variable `API_KEY` en Vercel, debes ir a la pestaña **'Deployments'**, elegir tu último despliegue y seleccionar **'Redeploy'**. Si no lo haces, el código viejo seguirá corriendo sin la clave. ✨";
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
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
      yield "¡Olá! Mi clave de acceso parece no ser válida o ha expirado. Por favor, verifica que la clave de Google AI Studio sea correcta. 🌊";
    } else {
      yield "¡Olá! Tuve un pequeño problema de conexión. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
