
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTermsAndConditions } from '../services/settingsService';

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsContent, setTermsContent] = useState('');
  const [imgError, setImgError] = useState(false);

  const openTerms = async (e: React.MouseEvent) => {
      e.preventDefault();
      setIsModalOpen(true);
      const text = await getTermsAndConditions();
      setTermsContent(text);
  };

  return (
    <>
    <footer className="bg-slate-950 text-white border-t-8 border-lime-500">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
                {!imgError ? (
                    <img 
                        src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" 
                        alt="Floripa Fácil" 
                        className="h-20 rounded-full border-2 border-lime-500/30 shadow-lg" 
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-20 h-20 bg-lime-500 rounded-full flex items-center justify-center text-slate-950 font-black text-2xl">FF</div>
                )}
                <div>
                    <h4 className="text-2xl font-black text-lime-400 leading-none">FLORIPA FÁCIL</h4>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Turismo Receptivo</p>
                </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Expertos en el litoral catarinense y principales polos turísticos de Brasil. Traslados in/out, excursiones exclusivas y movilidad garantizada para que tu única preocupación sea disfrutar del sol.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-lime-400">Nuestros Servicios</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/excursions" className="hover:text-white transition">Excursiones y Tours</Link></li>
              <li><Link to="/excursions" className="hover:text-white transition">Transfers Aeropuerto</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Alquiler de Coches</Link></li>
              <li><Link to="/accommodations" className="hover:text-white transition">Alojamientos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-lime-400">Contacto Directo</h4>
            <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-center gap-2">📍 Florianópolis, SC, Brasil</p>
                <p className="flex items-center gap-2">📞 +54 9 11 4063 2644</p>
                <p className="flex items-center gap-2">✉️ hola@floripafacil.com</p>
                <div className="pt-4 flex gap-4">
                    <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-lime-500 hover:text-green-950 transition-all">Ig</a>
                    <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-lime-500 hover:text-green-950 transition-all">Fb</a>
                </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Floripa Fácil - Todos los derechos reservados.</p>
          <button onClick={openTerms} className="mt-2 hover:text-white">Bases y Condiciones de Uso</button>
        </div>
      </div>
    </footer>

    {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center bg-green-50 rounded-t-2xl">
                    <h3 className="font-bold text-lg text-green-900">Bases y Condiciones</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="text-gray-500 text-2xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-600 whitespace-pre-wrap">{termsContent}</div>
                <div className="p-4 border-t text-right"><button onClick={()=>setIsModalOpen(false)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold">Cerrar</button></div>
            </div>
        </div>
    )}
    </>
  );
};

export default Footer;
