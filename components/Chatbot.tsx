
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToFlori } from '../services/geminiService';
import { ChatMessage } from '../types';

const FLORI_AVATAR = "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=200&h=200&auto=format&fit=crop";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: '¡Olá! Soy Flori, tu guía inteligente de Floripa Fácil. 🌴 ¿Cómo puedo ayudarte hoy? Consultame por traslados VIP, alquiler de autos o los mejores paseos por la isla. ✈️🚗🌊' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
        checkKeyStatus();
    }
  }, [messages, isOpen]);

  const checkKeyStatus = async () => {
      // Si estamos fuera de AI Studio y no hay process.env.API_KEY, necesitamos que el usuario seleccione una
      if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setNeedsKey(!hasKey && !process.env.API_KEY);
      }
  };

  const handleSelectKey = async () => {
      if (window.aistudio) {
          await window.aistudio.openSelectKey();
          setNeedsKey(false);
          setMessages(prev => [...prev, { id: 'key-ok', role: 'model', text: '¡Excelente! Ya estoy conectada. ¿En qué puedo ayudarte? 🌴✨' }]);
      }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    if (needsKey) {
        setMessages(prev => [...prev, { id: 'error-key', role: 'model', text: 'Por favor, primero vincula una conexión usando el botón "CONECTAR" arriba para que pueda responderte. 🌊' }]);
        return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

    try {
      let fullResponse = '';
      const stream = sendMessageToFlori(userMessage.text);
      
      let hasReceivedContent = false;
      for await (const chunk of stream) {
        hasReceivedContent = true;
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullResponse } : msg)
        );
      }

      if (!hasReceivedContent) throw new Error("No content");

    } catch (error: any) {
      console.error("Error en Chatbot:", error);
      if (error.message?.includes('API_KEY')) setNeedsKey(true);
      
      setMessages(prev => 
        prev.map(msg => msg.id === botMessageId ? { ...msg, text: "Tuve un problema de conexión. Si persiste, intenta reconectar usando el botón de arriba. 🌊" } : msg)
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl w-[90vw] sm:w-[400px] rounded-[2.5rem] shadow-2xl mb-4 border border-green-100 overflow-hidden flex flex-col h-[70vh] sm:h-[550px] animate-pop-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-lime-600 p-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-full overflow-hidden border-2 border-white/50 shadow-inner">
                  <img src={FLORI_AVATAR} alt="Flori" className="w-full h-full object-cover" />
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-green-600 rounded-full ${needsKey ? 'bg-red-400' : 'bg-lime-400'}`}></span>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest leading-none">Flori AI</h3>
                <p className="text-[9px] text-lime-100 font-bold uppercase mt-1">Especialista Floripa Fácil</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                {needsKey && (
                    <button 
                        onClick={handleSelectKey}
                        className="bg-white text-green-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg hover:scale-105 transition-all"
                    >
                        ⚡ Conectar
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-transform hover:rotate-90 p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 border border-green-100 mt-1">
                    <img src={FLORI_AVATAR} className="w-full h-full object-cover" alt="F" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none font-medium' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none font-medium'
                }`}>
                  {msg.text || (
                    <div className="flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder={needsKey ? "Vincula tu conexión arriba..." : "Escribe un mensaje..."}
                disabled={needsKey}
                className="w-full pl-5 pr-12 py-3 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-semibold text-sm transition-all border border-transparent focus:bg-white disabled:opacity-50"
              />
              <button 
                onClick={handleSend} 
                disabled={isTyping || !input.trim() || needsKey}
                className="absolute right-1.5 p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:bg-slate-300 shadow-md shadow-green-200"
              >
                <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <div className="relative">
        {!isOpen && (
            <div className="absolute -top-12 right-0 bg-white text-green-700 px-4 py-2 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest animate-bounce border-2 border-green-50 flex items-center gap-2 whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full animate-pulse ${needsKey ? 'bg-red-500' : 'bg-green-500'}`}></span>
                {needsKey ? '¡Vincular Flori!' : '¡Consultas Floripa Fácil!'}
            </div>
        )}
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="group relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white overflow-hidden"
            aria-label="Abrir chat con Flori"
        >
            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${needsKey ? 'bg-red-500' : 'bg-green-500'}`}></div>
            
            <div className={`absolute inset-0 transition-all duration-500 ${isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
                <img src={FLORI_AVATAR} className="w-full h-full object-cover" alt="Flori" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>

            <svg className={`absolute w-8 h-8 text-green-600 transition-all duration-500 ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
