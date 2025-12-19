
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: '¡Olá! Soy Flori, de Floripa Fácil. 🌴 Me especializo en traslados, paseos y alquiler de autos en Florianópolis y toda la región costera. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);
    try {
      const stream = sendMessageToGemini(userMsg.text);
      let fullText = '';
      for await (const chunk of stream) {
        if(chunk) {
            fullText += chunk;
            setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        }
      }
    } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-3xl shadow-2xl mb-4 border border-green-100 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-600 to-lime-600 p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/50"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Flori" alt="Flori" /></div>
              <div><h3 className="font-bold text-sm">Flori - Floripa Fácil</h3><p className="text-[10px] text-lime-100">Experta en Receptivo</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:rotate-90 transition-transform"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t flex items-center gap-2">
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Consultar por traslados o tours..." className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-lime-500 text-sm" />
            <button onClick={handleSend} disabled={isLoading} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"><svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative group">
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-500 rounded-full border-4 border-white animate-pulse"></span>}
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
    </div>
  );
};

export default Chatbot;
