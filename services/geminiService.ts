
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
    const apiKey = process.env.API_KEY;
    
    // Si no hay API KEY, lanzamos un error específico que el componente pueda atrapar
    if (!apiKey || apiKey === "") {
        throw new Error("AUTH_REQUIRED");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
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
    console.error("Error en Flori AI:", error);
    
    const errorMsg = error.message || "";
    
    // Si el error es de permisos o entidad no encontrada
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("API_KEY") || errorMsg.includes("403") || errorMsg === "AUTH_REQUIRED") {
        throw new Error("AUTH_REQUIRED");
    } else {
        yield "¡Olá! Tuve un pequeño problema técnico en la isla. ¿Podrías intentar escribirme de nuevo? 🌊✨";
    }
  }
};
