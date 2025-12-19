
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const location = useLocation();
  const { t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Excursiones', path: '/excursions', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Tours', path: '/trips', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Coches', path: '/cars', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-8 4h5" /></svg> },
    { name: 'Alojamientos', path: '/accommodations', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  ];

  const currencies = [
    { code: 'BRL', label: 'Real', flag: '🇧🇷' },
    { code: 'USD', label: 'Dólar', flag: '🇺🇸' },
    { code: 'ARS', label: 'Peso Arg', flag: '🇦🇷' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const currentCurr = currencies.find(c => c.code === currency) || currencies[0];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-lime-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center h-full py-2">
                <Link to="/" className="group h-full flex items-center">
                    {!imgError ? (
                        <img 
                            src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" 
                            alt="Floripa Fácil" 
                            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 max-h-[75px] rounded-full shadow-sm"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">FF</div>
                    )}
                    <span className="ml-3 font-black text-green-700 text-xl hidden lg:block tracking-tighter">FLORIPA FÁCIL</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-2">
                {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActive(link.path)
                        ? 'text-green-700 bg-green-50 font-bold'
                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <span className={`mb-1 ${isActive(link.path) ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`}>{link.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{link.name}</span>
                </Link>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <button onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-full border border-gray-100 hover:border-green-200 transition-all">
                        <span>{currentCurr.flag}</span> {currentCurr.code}
                    </button>
                    {currencyDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border z-50">
                            {currencies.map(c => (
                                <button key={c.code} onClick={() => { setCurrency(c.code as any); setCurrencyDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 flex items-center gap-2"><span>{c.flag}</span> {c.code}</button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-green-600 p-2"><svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg></button>
            </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold ${isActive(link.path) ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'}`}><span className="mr-3">{link.icon}</span>{link.name}</Link>
            ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
