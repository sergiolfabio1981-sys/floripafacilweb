
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGuides } from '../services/guideService';
import { DestinationGuide } from '../types';

const Guides: React.FC = () => {
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGuides().then(data => {
      setGuides(data.filter(g => g.active));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-green-700 py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">Descubrí Brasil</h1>
          <p className="text-xl md:text-2xl text-green-50 font-medium max-w-2xl mx-auto">Todo lo que necesitás saber si es tu primera vez visitando el paraíso. Guías detalladas hechas por expertos.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {guides.map(guide => (
            <Link 
              key={guide.id} 
              to={`/guides/${guide.id}`}
              className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl hover:-translate-y-4 transition-all duration-500"
            >
              <img src={guide.images[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col justify-end h-full">
                <span className="bg-lime-500 text-green-950 text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 tracking-widest uppercase">Guía de Destino</span>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase group-hover:text-lime-400 transition-colors">{guide.name}</h3>
                <p className="text-white/70 line-clamp-2 mb-6 font-medium leading-relaxed">{guide.summary}</p>
                <div className="flex items-center gap-2 text-lime-400 font-black text-xs uppercase tracking-widest">
                  Explorar Información 
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {guides.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[4rem] border-4 border-dashed border-gray-100">
             <div className="text-6xl mb-4">🏖️</div>
             <p className="text-gray-400 font-black uppercase tracking-widest">Estamos preparando las mejores guías para vos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;
