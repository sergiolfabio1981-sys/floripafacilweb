
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import { LOGO_URL } from '../constants';

const Navbar: React.FC = () => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { selectedItems } = usePlanner();

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: '🏠' },
    { name: 'Tours', path: '/trips', icon: '🎒' },
    { name: 'Traslados', path: '/excursions', icon: '🚐' },
    { name: 'Autos', path: '/cars', icon: '🚗' },
    { name: 'Admin', path: '/admin', icon: '⚙️' },
  ];

  const currencies = [
    { code: 'ARS', label: 'Peso Arg', flag: '🇦🇷' },
    { code: 'BRL', label: 'Real', flag: '🇧🇷' },
    { code: 'USD', label: 'Dólar', flag: '🇺🇸' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const currentCurr = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-lime-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center h-full py-1">
                <Link to="/" className="group h-full flex items-center">
                    <div className="relative h-14 w-14 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                        <img src={LOGO_URL} className="h-full w-full object-contain" alt="Floripa Fácil" />
                    </div>
                    <div className="ml-3 flex flex-col justify-center">
                        <span className="font-black text-green-700 text-lg leading-none tracking-tighter uppercase italic">FLORIPA FÁCIL</span>
                        <span className="font-bold text-gray-400 text-[9px] tracking-[0.2em] uppercase">Turismo & Traslados</span>
                    </div>
                </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
                {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${
                    isActive(link.path) ? 'text-green-700 bg-green-50 font-bold' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <span className="text-lg mb-1">{link.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{link.name}</span>
                </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Link to="/planner" className="relative p-2.5 text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-all">
                    🛒
                    {selectedItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                            {selectedItems.length}
                        </span>
                    )}
                </Link>
                <button onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} className="flex items-center gap-2 text-[10px] font-black text-gray-600 bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
                    <span>{currentCurr.flag}</span> {currentCurr.code}
                </button>
                {currencyDropdownOpen && (
                    <div className="absolute top-16 right-4 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        {currencies.map(c => (
                            <button key={c.code} onClick={() => { setCurrency(c.code as any); setCurrencyDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-green-50 flex items-center gap-2 text-gray-700 transition-colors">
                                <span>{c.flag}</span> {c.code}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
