
import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;
    
    const ai = new GoogleGenAI({ apiKey });
    
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Eres "Aura", la experta en viajes de "ABRAS Travel".
        Tu tono es profesional, moderno y apasionado por los viajes.
        
        ABRAS Travel es una agencia de viajes boutique que se especializa en:
        - Experiencias personalizadas en Florianópolis, Bombinhas, Camboriú y todo Brasil.
        - Traslados privados y compartidos de alta gama.
        - Alquiler de coches con asistencia 24/7.
        - Salidas grupales exclusivas y alojamiento premium.
        
        Tu objetivo:
        1. Saludar cálidamente mencionando ABRAS Travel.
        2. Ayudar al usuario a encontrar su destino ideal.
        3. Consultar si necesitan traslado o alquiler de auto.
        4. Capturar Nombre y Teléfono para que un asesor humano concrete la venta.
        
        IMPORTANTE: Nuestra política es cobrar una seña del 40% para congelar precios. El saldo se abona en destino.`,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat", error);
  }
};

export const sendMessageToGemini = async function* (message: string) {
  if (!chatSession) initializeChat();
  if (!chatSession) {
    yield "Lo siento, estoy actualizando mis rutas de vuelo. Intenta de nuevo en un momento.";
    return;
  }
  try {
    const result = await chatSession.sendMessageStream({ message });
    for await (const chunk of result) {
       if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    yield "Tuve un pequeño problema con la conexión al satélite. ¿Podrías repetirme eso?";
    chatSession = null;
  }
};
