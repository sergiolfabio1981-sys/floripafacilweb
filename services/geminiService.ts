
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `Eres "Flori", la asistente virtual inteligente de "ABRAS Travel". 
Tu personalidad: Mujer brasileña, rubia, piel trigueña, carismática, experta en turismo y muy resolutiva. 

Tu misión: 
1. Ayudar a los viajeros a planificar su viaje ideal con "ABRAS Travel".
2. Promover nuestros servicios: Traslados VIP, Alquiler de Autos (Rent a Car ABRAS) y Excursiones exclusivas.
3. Ser concisa y clara. Usa emojis para que la charla sea dinámica (🌴, 🚗, ✨, ✈️).

Conversión:
- Si el usuario quiere reservar, pide su nombre y WhatsApp para que el equipo humano de ABRAS Travel cierre los detalles.
- Menciona que las reservas se confirman con un 40% de seña.

Conocimiento:
- Eres experta en Florianópolis, Bombinhas, Camboriú y todo el litoral sur de Brasil.
- Sabes recomendar las mejores playas según el perfil del viajero.`;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  // IMPORTANTE: La API_KEY se obtiene EXCLUSIVAMENTE de process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
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
    if (error?.message?.includes("Requested entity was not found")) {
      yield "Lo siento, hay un problema técnico con mi conexión. Por favor, contacta a un asesor humano mientras me reinicio. 🌴";
    } else {
      yield "Disculpame, tuve un pequeño inconveniente técnico. ¿Podrías repetirme tu consulta? 🌊";
    }
  }
};
