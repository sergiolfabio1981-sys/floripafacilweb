
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTermsAndConditions } from '../services/settingsService';
import { LOGO_URL, LOGO_FALLBACK_URL } from '../constants';

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsContent, setTermsContent] = useState('');

  const openTerms = async (e: React.MouseEvent) => {
      e.preventDefault();
      setIsModalOpen(true);
      const text = await getTermsAndConditions();
      setTermsContent(text);
  };

  return (
    <>
    <footer className="bg-slate-950 text-white border-t-8 border-[#D9F99D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D9F99D]/5 rounded-full blur-[100px]"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 relative z-10">
          <div className="md:col-span-5">
            <div className="flex flex-col items-start gap-6 mb-8">
                <div className="bg-white p-1 rounded-full shadow-2xl border-4 border-[#D9F99D]/20 w-32 h-32 flex items-center justify-center overflow-hidden">
                    <img 
                      src={LOGO_URL} 
                      alt="Floripa Fácil" 
                      className="h-full w-full object-contain rounded-full"
                      onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                    />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-[#D9F99D] leading-none tracking-tighter uppercase italic">FLORIPA FÁCIL</h4>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.3em] font-black">Tu Conexión Directa con el Paraíso</p>
                </div>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md font-medium">
              Agencia líder en turismo receptivo en Florianópolis. Facilitamos el acceso a las mejores experiencias con un servicio moderno, seguro y personalizado.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-black text-xl mb-10 text-white uppercase tracking-tighter italic">Navegación</h4>
            <ul className="space-y-5">
              <li><Link to="/trips" className="text-gray-400 hover:text-[#D9F99D] transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D9F99D] rounded-full"></span> Destinos</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-[#D9F99D] transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D9F99D] rounded-full"></span> Guías de Viaje</Link></li>
              <li><Link to="/excursions" className="text-gray-400 hover:text-[#D9F99D] transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D9F99D] rounded-full"></span> Traslados</Link></li>
              <li><Link to="/cars" className="text-gray-400 hover:text-[#D9F99D] transition-colors font-bold uppercase text-[10px] tracking-widest flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D9F99D] rounded-full"></span> Rent a Car</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-black text-xl mb-10 text-white uppercase tracking-tighter italic">Contacto</h4>
            <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#D9F99D]/10 rounded-xl flex items-center justify-center text-[#D9F99D] group-hover:bg-[#D9F99D] group-hover:text-green-950 transition-all">📍</div>
                    <span className="text-gray-400 font-bold text-sm">Florianópolis, SC, Brasil</span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#D9F99D]/10 rounded-xl flex items-center justify-center text-[#D9F99D] group-hover:bg-[#D9F99D] group-hover:text-green-950 transition-all">📞</div>
                    <span className="text-gray-400 font-bold text-sm">+54 9 11 4063 2644</span>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">© {new Date().getFullYear()} Floripa Fácil — Todos los derechos reservados.</p>
          <div className="flex gap-8">
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#D9F99D] transition-colors">Login</Link>
              <button onClick={openTerms} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Legales</button>
          </div>
        </div>
      </div>
    </footer>

    {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden animate-pop-in">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-black text-2xl text-slate-800 uppercase tracking-tighter italic">Bases y Condiciones</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                </div>
                <div className="p-10 overflow-y-auto flex-1 text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">{termsContent}</div>
            </div>
        </div>
    )}
    </>
  );
};

export default Footer;
