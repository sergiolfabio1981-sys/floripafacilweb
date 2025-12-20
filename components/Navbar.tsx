
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
    { name: t('nav.home'), path: '/', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Destinos', path: '/guides', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { name: 'Tours', path: '/trips', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Traslados', path: '/excursions', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Admin', path: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
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
          AT
        </div>
      );
    }

    return (
      <img 
        src={imgStatus === 'fallback' ? LOGO_FALLBACK_URL : LOGO_URL} 
        alt="ABRAS Travel" 
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
                        <span className="font-black text-green-700 text-lg leading-none tracking-tighter uppercase italic">ABRAS Travel</span>
                        <span className="font-bold text-gray-400 text-[9px] tracking-[0.2em] uppercase">Experiencias Premium</span>
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
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
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-green-600 p-2"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
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
