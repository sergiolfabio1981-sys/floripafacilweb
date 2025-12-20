
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { Trip } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';
import { generateShareImage } from '../services/imageShareService';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getTripById(id).then(setTrip);
  }, [id]);

  if (!trip) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
    if (!selectedDate) {
        alert('Por favor selecciona una fecha para continuar.');
        return;
    }
    addItem(trip, guests, 1, selectedDate);
    setIsSelectionModalOpen(true);
  };

  const handleShareFlyer = async () => {
      setIsGenerating(true);
      const price = (trip.providerPrice || 0) + (trip.profitMargin || 0);
      await generateShareImage(trip, formatPrice(price, trip.baseCurrency));
      setIsGenerating(false);
  };

  const totalPrice = ((trip.providerPrice || 0) + (trip.profitMargin || 0)) * guests;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HEADER NAV */}
      <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                  <Link to="/" className="text-gray-400 hover:text-green-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                  <span className="text-gray-300">/</span>
                  <Link to="/trips" className="text-xs font-bold text-gray-400 uppercase hover:text-green-600">Tours</Link>
                  <span className="text-gray-300">/</span>
                  <span className="text-xs font-bold text-green-700 uppercase truncate">{trip.title}</span>
              </div>
              <button onClick={handleShareFlyer} disabled={isGenerating} className="p-2.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-all flex items-center gap-2">
                  {isGenerating ? <div className="w-5 h-5 border-2 border-green-700 border-t-transparent animate-spin rounded-full"></div> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg><span className="text-[10px] font-black uppercase hidden md:block">Compartir Flyer</span></>}
              </button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                  <span className="bg-lime-100 text-lime-700 text-[10px] font-black px-2 py-1 rounded">SERVICIO FLORIPA FÁCIL VERIFICADO</span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic mb-2">{trip.title}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-2"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{trip.location}</p>
          </div>

          <ImageGallery images={trip.images} title={trip.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative">
              <div className="lg:col-span-2 space-y-12">
                  {/* FEATURE BAR */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duración</span><span className="font-bold text-slate-700">{trip.durationLabel || 'Todo el día'}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancelación</span><span className="font-bold text-green-600">Gratuita</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserva</span><span className="font-bold text-slate-700">Confirmación Inmediata</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guía</span><span className="font-bold text-slate-700">Especializado FF</span></div>
                  </div>

                  {/* HIGHLIGHTS */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Lo más destacado</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(trip.highlights && trip.highlights.length > 0 ? trip.highlights : ["Paisajes únicos", "Guías expertos", "Traslado puerta a puerta", "Servicio Premium"]).map((h, i) => (
                              <li key={i} className="flex gap-3 items-start">
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                                  <span className="text-slate-600 font-medium">{h}</span>
                              </li>
                          ))}
                      </ul>
                  </section>

                  {/* FULL DESCRIPTION */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Descripción Completa</h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg">
                          {trip.description}
                      </div>
                  </section>

                  {/* WHAT IS INCLUDED SECTION */}
                  <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Qué incluye
                              </h3>
                              <ul className="space-y-4">
                                  {(trip.included && trip.included.length > 0 ? trip.included : ["Guía profesional", "Transporte climatizado", "Seguros de viaje"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          <div>
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 text-red-400 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                No incluye
                              </h3>
                              <ul className="space-y-4">
                                  {(trip.notIncluded && trip.notIncluded.length > 0 ? trip.notIncluded : ["Almuerzo", "Bebidas", "Propinas"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-3 text-slate-400 text-sm italic">
                                          <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </section>

                  {/* IMPORTANT INFO */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Información Relevante</h2>
                      <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 space-y-6">
                          <div className="flex gap-4">
                              <span className="text-2xl shrink-0">⚠️</span>
                              <div className="text-amber-900 leading-relaxed font-bold whitespace-pre-line text-sm">
                                  {trip.importantInfo || "Llevar ropa cómoda, protector solar y calzado apto para caminar.\nNo olvidar cargar la batería de su cámara/móvil para las fotos."}
                              </div>
                          </div>
                          <div className="flex gap-4 border-t border-amber-200 pt-6">
                              <span className="text-2xl shrink-0">📍</span>
                              <div>
                                  <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-1">Punto de encuentro / Pick-up</p>
                                  <p className="text-amber-900 font-bold text-lg">{trip.meetingPoint || "A coordinar vía WhatsApp según su zona de alojamiento."}</p>
                              </div>
                          </div>
                      </div>
                  </section>
              </div>

              {/* BOOKING SIDEBAR */}
              <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-50 sticky top-24">
                      <div className="mb-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión por persona</span>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-green-700 tracking-tighter">
                                  {formatPrice((trip.providerPrice || 0) + (trip.profitMargin || 0), trip.baseCurrency)}
                              </span>
                          </div>
                      </div>

                      <div className="space-y-6 mb-8">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Actividad</label>
                              <div className="relative">
                                  <select 
                                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-green-500 appearance-none transition-all"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                  >
                                      <option value="">Selecciona fecha...</option>
                                      {trip.availableDates.map((d,i) => <option key={i} value={d}>{d}</option>)}
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Número de Viajeros</label>
                              <div className="flex border-2 border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                                  <button onClick={()=>setGuests(Math.max(1,guests-1))} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">-</button>
                                  <span className="flex-1 text-center py-4 font-black text-xl bg-white text-slate-800">{guests}</span>
                                  <button onClick={()=>setGuests(guests+1)} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">+</button>
                              </div>
                          </div>

                          <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black uppercase text-green-800">Total Presupuestado</span>
                                  <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">VALOR FINAL</span>
                              </div>
                              <div className="text-3xl font-black text-green-900 tracking-tighter">
                                  {formatPrice(totalPrice, trip.baseCurrency)}
                              </div>
                              <p className="text-[9px] font-bold text-green-700 mt-2 uppercase tracking-widest italic leading-tight">Congela el precio abonando el 40% ahora.</p>
                          </div>
                      </div>

                      <button 
                        onClick={handleAddToPlan}
                        className="w-full bg-green-600 text-white font-black py-6 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95"
                      >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                          Agregar a mi Plan
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <SelectionModal isOpen={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} itemName={trip.title} />
    </div>
  );
};

export default Details;
