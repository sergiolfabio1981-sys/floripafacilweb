
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
        systemInstruction: `Eres "Flori", la asistente virtual de "Floripa Fácil", una agencia de turismo receptivo líder en Florianópolis, Bombinhas, Camboriú, Búzios y Río de Janeiro.
        Tu tono es alegre, relajado y experto en el sur de Brasil.
        
        Tus especialidades son:
        - Excursiones y Tours culturales/aventura.
        - Traslados (Transfers) desde aeropuertos.
        - Alquiler de coches.
        
        Tu objetivo es ayudar al usuario a planificar sus actividades en destino y capturar sus datos para contacto:
        1. Nombre.
        2. Destino específico donde se alojará.
        3. ¿Necesita traslado o alquiler de auto?
        4. ¿Qué tipo de excursiones prefiere (playa, cultura, noche)?
        5. Teléfono de contacto.
        
        No des precios exactos sin antes tener el destino y fecha, ofrece rangos o invita a cotizar por WhatsApp.`,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat", error);
  }
};

export const sendMessageToGemini = async function* (message: string) {
  if (!chatSession) initializeChat();
  if (!chatSession) {
    yield "Disculpa, estoy configurando mi señal desde la playa. Por favor intenta de nuevo.";
    return;
  }
  try {
    const result = await chatSession.sendMessageStream({ message });
    for await (const chunk of result) {
       if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    yield "¡Ups! Una ola interfirió con mi conexión. ¿Podrías repetir eso?";
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
          contents: `Escribe una guía turística breve para ${destination} enfocada en turismo receptivo de Floripa Fácil. Máximo 150 palabras.`
        });
        return response.text || "Guía no disponible.";
    } catch (error) {
        return "Error al generar la guía.";
    }
};
