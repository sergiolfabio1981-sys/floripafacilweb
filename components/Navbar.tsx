
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
    { name: t('nav.home'), path: '/' },
    { name: 'Tours', path: '/trips' },
    { name: 'Traslados', path: '/excursions' },
    { name: 'Autos', path: '/cars' },
    { name: 'Guías', path: '/guides' },
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
        <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0">
                <Link to="/" className="group flex items-center gap-4">
                    <div className="relative h-14 w-14 bg-white rounded-3xl flex items-center justify-center p-1.5 shadow-md border border-slate-50 group-hover:shadow-xl transition-all duration-500 group-hover:-rotate-6">
                        <img src={LOGO_URL} className="h-full w-full object-contain" alt="Floripa Fácil" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-[#064E3B] text-2xl leading-none tracking-tightest italic uppercase">Floripa Fácil</span>
                        <span className="font-black text-slate-400 text-[9px] tracking-[0.4em] uppercase mt-1">Premium Travel</span>
                    </div>
                </Link>
            </div>

            <div className="hidden lg:flex items-center bg-slate-100/50 p-2 rounded-[2rem] border border-slate-200/50">
                {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive(link.path) 
                        ? 'text-[#064E3B] bg-white shadow-md' 
                        : 'text-slate-500 hover:text-[#064E3B] hover:bg-white/50'
                    }`}
                >
                    {link.name}
                </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Link to="/planner" className="relative p-4 text-[#064E3B] bg-[#D9F99D] rounded-2xl hover:shadow-lg transition-all active:scale-90 border border-[#c5e68b]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {selectedItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                            {selectedItems.length}
                        </span>
                    )}
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} 
                    className="flex items-center gap-3 text-[11px] font-black text-slate-700 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all uppercase tracking-widest"
                  >
                      <span>{currentCurr.flag}</span> {currentCurr.code}
                  </button>
                  {currencyDropdownOpen && (
                      <div className="absolute top-full right-0 mt-3 w-44 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden p-2 animate-slide-up">
                          {currencies.map(c => (
                              <button 
                                key={c.code} 
                                onClick={() => { setCurrency(c.code as any); setCurrencyDropdownOpen(false); }} 
                                className="w-full text-left px-5 py-3 text-[11px] font-black hover:bg-green-50 flex items-center gap-3 text-slate-600 rounded-2xl transition-colors uppercase tracking-widest"
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
