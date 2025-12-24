
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
    { name: 'Destinos', path: '/trips', icon: '📍' },
    { name: 'Guías', path: '/guides', icon: '📖' },
    { name: 'Traslados', path: '/excursions', icon: '🚐' },
    { name: 'Autos', path: '/cars', icon: '🚗' },
  ];

  const currencies = [
    { code: 'ARS', label: 'Peso Arg', flag: '🇦🇷' },
    { code: 'BRL', label: 'Real', flag: '🇧🇷' },
    { code: 'USD', label: 'Dólar', flag: '🇺🇸' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const currentCurr = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative h-12 w-12 bg-white rounded-2xl flex items-center justify-center p-1 shadow-sm border border-slate-50 group-hover:shadow-md transition-all duration-500 group-hover:-rotate-3">
                        <img src={LOGO_URL} className="h-full w-full object-contain" alt="Floripa Fácil" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[#064E3B] text-xl leading-none tracking-tightest italic uppercase">Floripa Fácil</span>
                        <span className="font-bold text-slate-400 text-[8px] tracking-[0.3em] uppercase mt-1">Premium Travel Services</span>
                    </div>
                </Link>
            </div>

            <div className="hidden lg:flex items-center bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/50">
                {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive(link.path) 
                        ? 'text-[#064E3B] bg-white shadow-sm ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:text-[#064E3B] hover:bg-white/50'
                    }`}
                >
                    {link.name}
                </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Link to="/planner" className="relative p-3 text-[#064E3B] bg-[#D9F99D]/30 rounded-2xl hover:bg-[#D9F99D]/50 transition-all active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {selectedItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#064E3B] text-[#D9F99D] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                            {selectedItems.length}
                        </span>
                    )}
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} 
                    className="flex items-center gap-2 text-[10px] font-black text-slate-700 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                  >
                      <span>{currentCurr.flag}</span> {currentCurr.code}
                  </button>
                  {currencyDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden p-2 animate-pop-in">
                          {currencies.map(c => (
                              <button 
                                key={c.code} 
                                onClick={() => { setCurrency(c.code as any); setCurrencyDropdownOpen(false); }} 
                                className="w-full text-left px-4 py-2.5 text-[10px] font-black hover:bg-[#D9F99D]/20 flex items-center gap-3 text-slate-600 rounded-xl transition-colors uppercase tracking-widest"
                              >
                                  <span>{c.flag}</span> {c.code}
                              </button>
                          ))}
                      </div>
                  )}
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
