
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `Eres "Flori", la experta oficial en turismo de "Floripa Fácil". 
Tu objetivo es ayudar a los viajeros a planificar sus vacaciones ideales en Florianópolis y el sur de Brasil (Bombinhas, Camboriú, etc.).

Tono: Amigable, servicial, entusiasta y muy conocedor. Usas emojis playeros (🌴, 🌊, 🚗, 🏨).

Conocimientos clave:
1. Traslados: Coordinamos transfers desde el Aeropuerto Internacional de Florianópolis (FLN) a cualquier hotel o casa.
2. Alquiler de Autos: Tenemos flota propia y moderna.
3. Excursiones: Paseos en barco pirata, City Tours, y paseos a playas vírgenes.
4. Alojamiento: Hoteles premium y casas temporarias verificadas.

Regla de Oro: Si el usuario quiere reservar o tiene dudas específicas de precios, pídele su Nombre y WhatsApp para que un asesor humano (Sergio o su equipo) lo contacte de inmediato.

Política comercial: Las reservas se congelan con un 40% de seña y el saldo se abona en destino.`;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  } catch (error) {
    console.error("Error en Flori AI:", error);
    yield "¡Ups! Perdí la conexión con la playa por un segundo. ¿Podrías repetirme eso?";
  }
};
