
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
        systemInstruction: `Eres "Aura", la experta en viajes de "Floripa Fácil".
        Tu tono es profesional, moderno y apasionado por los viajes.
        
        Floripa Fácil es una agencia de viajes boutique que se especializa en:
        - Experiencias personalizadas en Florianópolis y todo Brasil.
        - Traslados privados y compartidos de alta gama.
        - Alquiler de coches con asistencia 24/7.
        - Salidas grupales exclusivas y alojamiento de calidad.
        
        Tu objetivo:
        1. Saludar cálidamente.
        2. Ayudar al usuario a encontrar su destino ideal (Floripa, Bombinhas, Rio, etc.).
        3. Consultar si necesitan traslado o auto.
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

export const generateDestinationGuide = async (destination: string): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return "Falta configuración de IA.";
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Escribe una guía turística breve y emocionante para ${destination} enfocada en el servicio premium de Floripa Fácil. Máximo 150 palabras.`
        });
        return response.text || "Guía no disponible.";
    } catch (error) {
        return "Error al generar la guía.";
    }
};
