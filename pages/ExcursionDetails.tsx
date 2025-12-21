
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExcursionById } from '../services/excursionService';
import { Excursion } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';
import { generateShareImage } from '../services/imageShareService';

const ExcursionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [excursion, setExcursion] = useState<Excursion | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getExcursionById(id).then(setExcursion);
  }, [id]);

  if (!excursion) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const pricePerWay = (excursion.providerPrice || 0) + (excursion.profitMargin || 0);
  const vehiclesNeeded = passengers > 4 ? Math.ceil(passengers / 4) : 1;
  const tripMultiplier = tripType === 'round-trip' ? 2 : 1;
  const totalPrice = pricePerWay * vehiclesNeeded * tripMultiplier;

  const handleAddToPlan = () => {
      if(!selectedDate) {
          alert("Seleccione la fecha de su traslado");
          return;
      }
      if(tripType === 'round-trip' && !returnDate) {
          alert("Por favor, seleccione la fecha de regreso para el trayecto de vuelta");
          return;
      }

      const tripLabel = tripType === 'one-way' ? 'Solo Ida' : `Ida y Vuelta (Regreso: ${returnDate})`;
      addItem(excursion, passengers, tripMultiplier, selectedDate, tripLabel);
      setIsSelectionModalOpen(true);
  };

  const handleShareFlyer = async () => {
    setIsGenerating(true);
    await generateShareImage(excursion, formatPrice(pricePerWay, excursion.baseCurrency));
    setIsGenerating(false);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER NAVIGATION */}
      <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                  <Link to="/" className="text-gray-400 hover:text-green-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                  <span className="text-gray-300">/</span>
                  <Link to="/excursions" className="text-xs font-bold text-gray-400 uppercase hover:text-green-600">Traslados</Link>
                  <span className="text-gray-300">/</span>
                  <span className="text-xs font-bold text-green-700 uppercase truncate">{excursion.title}</span>
              </div>
              <div className="flex gap-2">
                  <button onClick={handleShareFlyer} disabled={isGenerating} className="p-2.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-all flex items-center gap-2 shadow-sm">
                      {isGenerating ? <div className="w-5 h-5 border-2 border-green-700 border-t-transparent animate-spin rounded-full"></div> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg><span className="text-[10px] font-black uppercase hidden md:block">Compartir Flyer</span></>}
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                  <span className="bg-lime-100 text-lime-700 text-[10px] font-black px-2 py-1 rounded">PUNTUALIDAD Y SEGURIDAD GARANTIZADA</span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic mb-2">{excursion.title}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-2 uppercase tracking-widest text-xs">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {excursion.location} — Traslado Privado Puerta a Puerta
              </p>
          </div>

          <ImageGallery images={excursion.images} title={excursion.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative">
              <div className="lg:col-span-2 space-y-12">
                  {/* FEATURE BAR */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🏁</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encuentro</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">Nombre y Cartel</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🧳</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Maletas</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">Amplio Baúl</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">❄️</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confort</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">Climatizado</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🛡️</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Habilitación</span>
                          <span className="font-bold text-green-600 text-xs mt-1">Seguro Total</span>
                      </div>
                  </div>

                  {/* TRIP TYPE SELECTOR */}
                  <section className="bg-white p-8 rounded-[3rem] border-4 border-lime-400 shadow-xl">
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6 flex items-center gap-3">
                          <span className="bg-lime-400 text-green-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                          ¿Qué tipo de viaje necesitas?
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button 
                            onClick={() => setTripType('one-way')}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tripType === 'one-way' ? 'border-green-600 bg-green-50 shadow-inner' : 'border-slate-100 hover:border-lime-300'}`}
                          >
                              <span className="text-3xl">➡️</span>
                              <span className="font-black text-sm uppercase tracking-widest">Solo Ida</span>
                              <span className="text-[10px] text-slate-400 font-bold">UN TRAYECTO</span>
                          </button>
                          <button 
                            onClick={() => setTripType('round-trip')}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tripType === 'round-trip' ? 'border-green-600 bg-green-50 shadow-inner' : 'border-slate-100 hover:border-lime-300'}`}
                          >
                              <span className="text-3xl">🔄</span>
                              <span className="font-black text-sm uppercase tracking-widest">Ida y Vuelta</span>
                              <span className="text-[10px] text-green-600 font-bold">¡TODO RESUELTO!</span>
                          </button>
                      </div>
                  </section>

                  {/* HIGHLIGHTS */}
                  <section>
                      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic mb-8">Beneficios Incluidos</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                              {t: "Monitoreo de vuelo", d: "Si tu vuelo se retrasa, te esperamos sin costo adicional."},
                              {t: "Meet & Greet", d: "El chofer te espera con un cartel personalizado en Arribos."},
                              {t: "Tarifa Final", d: "Peajes y tasas de estacionamiento ya están en el precio."},
                              {t: "Soporte 24/7", d: "WhatsApp de emergencia activo para tu llegada."},
                          ].map((h, i) => (
                              <div key={i} className="flex gap-4 items-start bg-slate-50 p-5 rounded-3xl border border-slate-100 group shadow-sm">
                                  <div className="w-10 h-10 rounded-2xl bg-white text-green-600 flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:bg-green-600 group-hover:text-white font-bold">✓</div>
                                  <div>
                                      <p className="font-black text-slate-800 text-sm uppercase tracking-widest">{h.t}</p>
                                      <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">{h.d}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>

                  {/* DESCRIPTION */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Información del Vehículo</h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg bg-slate-50 p-8 rounded-[2.5rem]">
                          {excursion.description || "Vehículos modernos sedán o SUV según disponibilidad. Todos cuentan con aire acondicionado, habilitación de transporte de pasajeros y choferes profesionales bilingües/expertos en la zona."}
                      </div>
                  </section>
              </div>

              {/* BOOKING SIDEBAR */}
              <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-50 sticky top-24">
                      <div className="mb-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Estimada</span>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-green-700 tracking-tighter">
                                  {formatPrice(totalPrice, excursion.baseCurrency)}
                              </span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                            {tripType === 'round-trip' ? '* Precio Total por Ida y Vuelta' : '* Precio por un trayecto'}
                          </p>
                      </div>

                      <div className="space-y-6 mb-8">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Ida / Arribo</label>
                              <input 
                                type="date" 
                                className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl font-bold outline-none focus:border-green-500 transition-all"
                                value={selectedDate}
                                onChange={(e)=>setSelectedDate(e.target.value)}
                              />
                          </div>

                          {tripType === 'round-trip' && (
                            <div className="bg-lime-50 p-4 rounded-2xl border border-lime-100 animate-fade-in-up">
                                <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-2 ml-1">Fecha de Regreso / Partida</label>
                                <input 
                                  type="date" 
                                  min={selectedDate}
                                  className="w-full bg-white border-2 border-lime-200 p-4 rounded-xl font-bold outline-none focus:border-green-500 transition-all"
                                  value={returnDate}
                                  onChange={(e)=>setReturnDate(e.target.value)}
                                />
                            </div>
                          )}

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pasajeros</label>
                              <div className="flex bg-white rounded-xl overflow-hidden border-2 border-slate-100">
                                  <button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="px-6 py-4 hover:bg-slate-50 transition-colors font-black text-xl text-slate-600">-</button>
                                  <span className="flex-1 text-center py-4 font-black text-xl text-slate-800">{passengers}</span>
                                  <button onClick={()=>setPassengers(passengers+1)} className="px-6 py-4 hover:bg-slate-50 transition-colors font-black text-xl text-slate-600">+</button>
                              </div>
                              {passengers > 4 && (
                                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                                    <span className="text-lg">🚐</span>
                                    <p className="text-[9px] text-amber-700 font-black uppercase tracking-tight leading-none">Requiere {vehiclesNeeded} vehículos o categoría VAN</p>
                                </div>
                              )}
                          </div>

                          <div className="bg-green-600 p-6 rounded-[2.5rem] shadow-xl shadow-green-200">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black uppercase text-white/80">Valor de Reserva</span>
                                  <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full">40% AHORA</span>
                              </div>
                              <div className="text-3xl font-black text-white tracking-tighter">
                                  {formatPrice(totalPrice * 0.40, excursion.baseCurrency)}
                              </div>
                              <p className="text-[9px] font-bold text-lime-200 mt-2 uppercase tracking-widest italic leading-tight">El saldo (60%) se abona en destino.</p>
                          </div>
                      </div>

                      <button 
                        onClick={handleAddToPlan}
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-green-600 transition-all shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95"
                      >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                          Confirmar Traslado
                      </button>
                  </div>
              </div>
          </div>
      </div>
      <SelectionModal isOpen={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} itemName={excursion.title} />
    </div>
  );
};

export default ExcursionDetails;
