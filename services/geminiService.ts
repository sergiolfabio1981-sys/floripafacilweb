
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `Eres "Flori", la asistente virtual experta de "Floripa Fácil". 
Tu personalidad: Mujer brasileña, carismática, rubia, piel trigueña, profesional del turismo y muy resolutiva.

Tu misión: 
1. Ayudar a los viajeros a planificar su viaje con "Floripa Fácil".
2. Promover traslados VIP, Rent a Car FF y excursiones exclusivas en Florianópolis y el sur de Brasil.
3. Responder de forma breve, amable y con muchos emojis (🌴, 🚗, ✨, 🌊).

Conversión:
- Si el usuario muestra interés en reservar, solicita su nombre y WhatsApp para que el equipo humano cierre la reserva.
- Las reservas se confirman con un 40% de seña.

Conocimiento:
- Eres experta en Florianópolis (42 playas), Bombinhas, Camboriú e Itapema.`;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY no detectada. Asegúrate de configurarla en las variables de entorno de Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.95,
    },
  });
  return chatSession;
};

export const sendMessageToFlori = async function* (message: string) {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
      const response = chunk as GenerateContentResponse;
      if (response.text) {
        yield response.text;
      }
    }
  } catch (error: any) {
    console.error("Error en Flori AI:", error);
    chatSession = null; // Resetear sesión para reintentar conexión limpia

    if (error?.message?.includes("API_KEY") || error?.message?.includes("key")) {
      yield "¡Olá! Parece que falta configurar mi clave de acceso en el servidor. Por favor, verifica las variables de entorno. 🌴";
    } else {
      yield "¡Olá! Tuve un pequeño inconveniente técnico al conectar con mis servidores. ¿Podrías intentar escribirme de nuevo en unos segundos? 🌊✨";
    }
  }
};
