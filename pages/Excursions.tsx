
import React, { useState, useEffect } from 'react';
import { getExcursions } from '../services/excursionService';
import { Excursion } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { Link } from 'react-router-dom';

const Excursions: React.FC = () => {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passengers, setPassengers] = useState(2);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
        const data = await getExcursions();
        setExcursions(data.map(e => ({...e, type: 'excursion' as const})));
    };
    fetchData();
  }, []);

  const filteredExcursions = excursions.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
        {/* HERO & SEARCH WIDGET */}
        <div className="bg-green-700 pt-16 pb-32 px-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
             <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
                 <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">Traslados Premium</h1>
                 <p className="text-xl text-green-50 mb-12 font-medium">Seguridad, puntualidad y el mejor servicio desde que aterrizas.</p>
                 
                 {/* BOOKING WIDGET */}
                 <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-4 border-lime-400 flex flex-col md:flex-row items-center gap-4 text-gray-800">
                    <div className="flex-1 w-full text-left">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">¿A dónde vas?</label>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Ej: Aeropuerto FLN a Canasvieiras..."
                                className="w-full bg-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">📍</div>
                        </div>
                    </div>
                    <div className="w-full md:w-48 text-left">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Pasajeros</label>
                        <select 
                            className="w-full bg-slate-100 px-6 py-4 rounded-2xl outline-none font-bold appearance-none cursor-pointer"
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                        >
                            {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n}>{n} {n===1?'Pasajero':'Pasajeros'}</option>)}
                        </select>
                    </div>
                    <button className="w-full md:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-900/20 active:scale-95">
                        Buscar
                    </button>
                 </div>
             </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 pb-20">
            <div className="space-y-6">
                {filteredExcursions.map(exc => {
                    const price = exc.providerPrice + exc.profitMargin;
                    const totalPrice = price * (passengers > 4 ? Math.ceil(passengers/4) : 1); // Lógica simple de vehículos extra
                    
                    return (
                        <div key={exc.id} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:border-green-200 transition-all">
                            {/* Vehicle Image */}
                            <div className="md:w-64 h-48 bg-slate-100 relative shrink-0">
                                <img src={exc.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                <div className="absolute top-4 left-4 bg-green-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">Verificado FF</div>
                            </div>

                            {/* Service Info */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">{exc.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">📍 {exc.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100">
                                            <span className="text-sm">👥</span>
                                            <span className="text-[10px] font-black">HASTA 4</span>
                                        </div>
                                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100">
                                            <span className="text-sm">🧳</span>
                                            <span className="text-[10px] font-black">X4</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        MEET & GREET INCLUIDO
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        CANCELACIÓN GRATUITA
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div className="text-gray-400 text-[10px] font-medium max-w-xs">
                                        Vehículo privado con aire acondicionado. El chofer lo esperará con un cartel en la zona de arribos.
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Precio Total</p>
                                        <p className="text-4xl font-black text-green-700 tracking-tighter">{formatPrice(totalPrice, exc.baseCurrency)}</p>
                                        <Link to={`/excursions/${exc.id}`} className="mt-2 inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg">
                                            Reservar ahora
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {filteredExcursions.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-100">
                    <div className="text-6xl mb-4">🚐</div>
                    <p className="text-gray-400 font-black uppercase tracking-widest">No encontramos el trayecto que buscas.</p>
                    <a href="https://wa.me/5491140632644" className="text-green-600 underline font-bold mt-2 block">Consultar por trayecto personalizado vía WhatsApp</a>
                </div>
            )}
        </div>

        {/* PROMO BANNER SECTION */}
        <div className="bg-slate-900 py-20 px-4 text-center">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4">¿Por qué reservar tu traslado con Floripa Fácil?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-3xl mb-4 border border-green-500/50">🛡️</div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Seguridad Total</h4>
                        <p className="text-gray-400 text-xs font-medium">Vehículos habilitados y choferes con años de experiencia en la isla.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center text-3xl mb-4 border border-lime-500/50">⌚</div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Puntualidad</h4>
                        <p className="text-gray-400 text-xs font-medium">Monitoreamos tu vuelo en tiempo real. Si se retrasa, te esperamos igual.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl mb-4 border border-blue-500/50">🤝</div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Sin Sorpresas</h4>
                        <p className="text-gray-400 text-xs font-medium">Precio final cerrado al reservar. Sin cargos extra por maletas o tráfico.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Excursions;
