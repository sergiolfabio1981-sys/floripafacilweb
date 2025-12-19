
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTermsAndConditions } from '../services/settingsService';

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
    <footer className="bg-slate-900 text-white border-t-8 border-lime-500">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <img src="https://i.postimg.cc/mD8G8h4H/Logo-Floripa-Facil.png" alt="Floripa Fácil" className="h-16 mb-6 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Tu socio receptivo en el sur de Brasil. Especialistas en hacer de tu estadía una experiencia fácil, segura e inolvidable. Floripa, Bombinhas y más allá.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-lime-400">Servicios</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/excursions" className="hover:text-white transition">Excursiones y Tours</Link></li>
              <li><Link to="/excursions" className="hover:text-white transition">Traslados In/Out</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Alquiler de Coches</Link></li>
              <li><Link to="/accommodations" className="hover:text-white transition">Alojamientos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-lime-400">Contacto</h4>
            <div className="space-y-4 text-sm text-gray-400">
                <p>📍 Florianópolis, Santa Catarina, Brasil</p>
                <p>📞 +55 48 99123-4567</p>
                <p>✉️ hola@floripafacil.com</p>
                <div className="pt-4 flex gap-4">
                    <span className="cursor-pointer hover:text-lime-400">Instagram</span>
                    <span className="cursor-pointer hover:text-lime-400">Facebook</span>
                </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Floripa Fácil - Turismo Receptivo.</p>
          <button onClick={openTerms} className="mt-2 hover:text-white">Bases y Condiciones</button>
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
