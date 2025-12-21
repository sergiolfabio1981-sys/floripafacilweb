
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import { LOGO_URL, LOGO_FALLBACK_URL } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [imgStatus, setImgStatus] = useState<'loading' | 'ok' | 'fallback' | 'error'>('loading');

  const location = useLocation();
  const { t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { selectedItems } = usePlanner();

  const navLinks = [
    { 
      name: t('nav.home'), 
      path: '/', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ) 
    },
    { 
      name: 'Destinos', 
      path: '/guides', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-10.5v.115c0 .857-.183 1.694-.518 2.47a9.01 9.01 0 01-1.197 2.048 9.01 9.01 0 01-2.22 1.967 9.021 9.021 0 01-3.14 1.068 8.978 8.978 0 01-2.993-.115V6.75m12 0l-3.21 3.21m0 0a1.5 1.5 0 01-2.122 0l-3.21-3.21m5.332 5.332L21 21M3 21l3.586-3.586m0 0A1.5 1.5 0 018.707 17h6.586a1.5 1.5 0 011.06 2.586L13 22.586 9.414 19a1.5 1.5 0 010-2.122l3.586-3.586" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) 
    },
    { 
      name: 'Tours', 
      path: '/trips', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ) 
    },
    { 
      name: 'Traslados', 
      path: '/excursions', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.806H5.433a2.056 2.056 0 00-1.58.806 17.902 17.902 0 00-3.213 9.193c-.039.62.469 1.124 1.09 1.124h1.125m12.75 0h-1.5m-5.25 0h-1.5" />
        </svg>
      ) 
    },
    { 
      name: 'Autos', 
      path: '/cars', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l7.5-4.5M15.75 12l-7.5 4.5" />
        </svg>
      ) 
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
        </svg>
      ) 
    },
  ];

  const currencies = [
    { code: 'ARS', label: 'Peso Arg', flag: '🇦🇷' },
    { code: 'BRL', label: 'Real', flag: '🇧🇷' },
    { code: 'USD', label: 'Dólar', flag: '🇺🇸' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const currentCurr = currencies.find(c => c.code === currency) || currencies[0];

  const renderLogoImage = () => {
    if (imgStatus === 'error') {
      return (
        <div className="h-full w-full bg-gradient-to-br from-green-600 to-lime-500 flex items-center justify-center text-white font-black text-xs">
          FF
        </div>
      );
    }

    return (
      <img 
        src={imgStatus === 'fallback' ? LOGO_FALLBACK_URL : LOGO_URL} 
        alt="Floripa Fácil" 
        className="h-full w-full object-contain"
        onLoad={() => setImgStatus('ok')}
        onError={() => {
          if (imgStatus === 'loading') setImgStatus('fallback');
          else setImgStatus('error');
        }}
      />
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-lime-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center h-full py-1">
                <Link to="/" className="group h-full flex items-center">
                    <div className="relative h-14 w-14 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 border border-gray-100">
                        {renderLogoImage()}
                    </div>
                    <div className="ml-3 flex flex-col justify-center">
                        <span className="font-black text-green-700 text-lg leading-none tracking-tighter uppercase italic">Floripa Fácil</span>
                        <span className="font-bold text-gray-400 text-[9px] tracking-[0.2em] uppercase">Turismo Receptivo</span>
                    </div>
                </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
                {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 group ${
                    isActive(link.path)
                        ? 'text-green-700 bg-green-50 font-bold'
                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <span className={`mb-1 transition-transform group-hover:scale-110 ${isActive(link.path) ? 'text-green-600' : 'text-gray-300'}`}>{link.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{link.name}</span>
                </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Link to="/planner" className="relative p-2.5 text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-all mr-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    {selectedItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                            {selectedItems.length}
                        </span>
                    )}
                </Link>

                <div className="relative group">
                    <button onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} className="flex items-center gap-2 text-[10px] font-black text-gray-600 bg-gray-50 px-3 py-2 rounded-full border border-gray-100 hover:border-green-200 transition-all">
                        <span>{currentCurr.flag}</span> {currentCurr.code}
                    </button>
                    {currencyDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                            {currencies.map(c => (
                                <button key={c.code} onClick={() => { setCurrency(c.code as any); setCurrencyDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-green-50 flex items-center gap-2 text-gray-700 transition-colors">
                                    <span>{c.flag}</span> {c.code}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-green-600 p-2"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
            </div>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden bg-white border-t p-4 space-y-2 animate-fade-in shadow-xl">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center px-4 py-4 rounded-xl text-sm font-black uppercase tracking-widest ${isActive(link.path) ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}>
                <span className="mr-3">{link.icon}</span>{link.name}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
