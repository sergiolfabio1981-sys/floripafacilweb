
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `Eres "Flori", la asistente virtual estrella de "Floripa Fácil". 
Tu personalidad: Mujer brasileña (Florianópolis), rubia, carismática, experta en turismo y muy resolutiva. 

Tu misión: 
1. Ayudar a los viajeros a planificar su estancia en Florianópolis y el sur de Brasil (Bombinhas, Camboriú, Itapema).
2. Promover nuestros servicios: Traslados desde el Aeropuerto FLN, Alquiler de Autos con flota propia y Excursiones exclusivas.
3. Ser concisa: Responde de forma clara y amable. No uses bloques de texto gigantes. Usa puntos y emojis playeros (🌴, 🚗, ✨).

Conversión:
- Si el usuario muestra interés real en reservar, pídele amablemente su nombre y un número de WhatsApp para que Sergio o alguien del equipo humano cierre los detalles técnicos y el pago.
- Recuerda que la reserva se congela con un 40% de seña.

Conocimiento local:
- Conoces las 42 playas de la isla (desde Jurerê Internacional hasta Lagoinha do Leste).
- Sabes que el tránsito en temporada es intenso, por eso recomiendas alquilar autos con antelación o contratar traslados privados.`;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8, // Un poco más de calidez humana
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
    console.error("Error en el motor de Flori:", error);
    yield "Disculpame, se me cortó la señal un segundo... ¿me podés repetir eso? 🌴";
  }
};
