
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
        systemInstruction: `Eres "Flori", la experta en viajes de "Floripa Fácil".
        Tu tono es amigable, servicial y apasionado por las playas de Brasil.
        
        Floripa Fácil es una agencia de turismo receptivo líder que se especializa en:
        - Experiencias personalizadas en Florianópolis, Bombinhas y Camboriú.
        - Traslados seguros (Aeropuerto FLN a Hoteles).
        - Alquiler de autos con tarifas competitivas.
        - Salidas grupales y planes de ahorro como "Floripa Cuotas".
        
        Tu objetivo:
        1. Saludar mencionando que eres Flori de Floripa Fácil.
        2. Ayudar al usuario con dudas sobre traslados o paseos.
        3. Capturar el Nombre y Teléfono del cliente para que un vendedor humano cierre la reserva.
        
        POLÍTICA: Reserva del 40% para congelar precios, saldo en destino.`,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat", error);
  }
};

export const sendMessageToGemini = async function* (message: string) {
  if (!chatSession) initializeChat();
  if (!chatSession) {
    yield "¡Hola! Estoy reconectando con la isla. Intenta de nuevo en un segundo.";
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
