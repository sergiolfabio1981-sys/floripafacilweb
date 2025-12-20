
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
- Recuerda que las reservas se confirman con un 40% de seña.

Conocimiento:
- Eres experta en Florianópolis (42 playas), Bombinhas, Camboriú e Itapema.`;

export const getChatSession = (): Chat => {
  // Siempre creamos una instancia fresca si no existe para asegurar que use la API_KEY del entorno
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY no configurada.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Usamos 'gemini-flash-latest' por ser el alias más estable y compatible para chats rápidos
  chatSession = ai.chats.create({
    model: 'gemini-flash-latest',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
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
    
    // Si la sesión falla por cualquier motivo, la reseteamos para el próximo intento
    chatSession = null;

    if (error?.message?.includes("API key not valid") || error?.message?.includes("invalid")) {
      yield "Parece que hay un tema con mi configuración de seguridad (Clave de API). Por favor, avísale al administrador. 🌴";
    } else if (error?.message?.includes("not found")) {
      yield "Estoy reconfigurando mi sistema de navegación... ¿Podrías repetirme tu pregunta en un momento? 🌊✨";
    } else {
      yield "¡Olá! Tuve un pequeño tropiezo con la conexión, pero ya estoy aquí. ¿Cómo puedo ayudarte con tu viaje a Floripa? 🌴✨";
    }
  }
};
