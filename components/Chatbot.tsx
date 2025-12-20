
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToFlori } from '../services/geminiService';
import { ChatMessage } from '../types';

const FLORI_AVATAR = "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=200&h=200&auto=format&fit=crop";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: '¡Olá! Soy Flori, tu guía experta de Floripa Fácil. 🌴 ¿Te gustaría que te ayude a organizar tus traslados, paseos o buscar el auto ideal para recorrer la isla?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

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
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => msg.id === botMessageId ? { ...msg, text: fullResponse } : msg)
        );
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-xl w-80 sm:w-[400px] rounded-[2.5rem] shadow-2xl mb-4 border border-green-100 overflow-hidden flex flex-col h-[550px] animate-pop-in">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-600 to-lime-600 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-lg">
                <img 
                  src={FLORI_AVATAR} 
                  alt="Flori" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm uppercase tracking-widest">Flori</h3>
                  <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></span>
                </div>
                <p className="text-[10px] text-lime-100 font-bold uppercase tracking-tighter">Experta en Brasil</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-transform hover:rotate-90 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 shrink-0 border border-green-100 shadow-sm">
                    <img src={FLORI_AVATAR} className="w-full h-full object-cover" alt="Flori" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none font-medium'
                }`}>
                  {msg.text || <div className="flex gap-1 py-1"><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span></div>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Pregúntale a Flori..." 
                className="w-full pl-6 pr-14 py-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm transition-all"
              />
              <button 
                onClick={handleSend} 
                disabled={isTyping || !input.trim()}
                className="absolute right-2 p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:bg-slate-300"
              >
                <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-3 font-bold uppercase tracking-tighter">Asistente Virtual impulsada por Floripa Fácil</p>
          </div>
        </div>
      )}

      {/* Launcher Button con la cara de Flori */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="group relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white overflow-visible"
        aria-label="Abrir chat"
      >
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        
        {/* Avatar en el botón */}
        <div className={`absolute inset-0 rounded-full overflow-hidden transition-all duration-500 ${isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
          <img src={FLORI_AVATAR} className="w-full h-full object-cover" alt="Flori Avatar" />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Icono de cerrar cuando está abierto */}
        <svg className={`absolute w-8 h-8 text-green-600 transition-all duration-500 ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-20 bg-white text-green-700 px-4 py-2 rounded-xl shadow-xl font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border-2 border-green-50 pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ¡Hola! Soy Flori 👋
          </div>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
