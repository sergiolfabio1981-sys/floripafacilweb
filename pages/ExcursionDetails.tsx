
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
  const [passengers, setPassengers] = useState(2);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getExcursionById(id).then(setExcursion);
  }, [id]);

  if (!excursion) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
      if(!selectedDate) {
          alert("Seleccione una fecha preferida");
          return;
      }
      addItem(excursion, passengers, 1, selectedDate);
      setIsSelectionModalOpen(true);
  };

  const handleShareFlyer = async () => {
    setIsGenerating(true);
    const price = (excursion.providerPrice || 0) + (excursion.profitMargin || 0);
    await generateShareImage(excursion, formatPrice(price, excursion.baseCurrency));
    setIsGenerating(false);
  };

  const totalPrice = ((excursion.providerPrice || 0) + (excursion.profitMargin || 0)) * passengers;

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
                  <button onClick={handleShareFlyer} disabled={isGenerating} className="p-2.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-all">
                      {isGenerating ? <div className="w-5 h-5 border-2 border-green-700 border-t-transparent animate-spin rounded-full"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded">SERVICIO VERIFICADO</span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-gray-400 text-xs font-bold">(Excursión Receptiva)</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic mb-2">{excursion.title}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-2"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{excursion.location}</p>
          </div>

          <ImageGallery images={excursion.images} title={excursion.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative">
              <div className="lg:col-span-2 space-y-12">
                  {/* QUICK INFO */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-green-50 rounded-3xl border border-green-100">
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Duración Estimada</span>
                          <span className="font-bold text-green-900">{excursion.duration}</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Disponibilidad</span>
                          <span className="font-bold text-green-900">{excursion.availableDates.join(', ')}</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-black text-green-800 uppercase tracking-widest">Tipo de Servicio</span>
                          <span className="font-bold text-green-900">Privado / Compartido</span>
                      </div>
                  </div>

                  {/* HIGHLIGHTS */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Detalles de la Experiencia</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(excursion.highlights || ["Traslado puerta a puerta", "Choferes profesionales", "Seguro de pasajero", "Vehículo moderno"]).map((h, i) => (
                              <li key={i} className="flex gap-3 items-start">
                                  <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center shrink-0 mt-0.5"><svg className="w-4 h-4 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                                  <span className="text-slate-600 font-medium">{h}</span>
                              </li>
                          ))}
                      </ul>
                  </section>

                  {/* DESCRIPTION */}
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Descripción del Servicio</h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg">
                          {excursion.description}
                      </div>
                  </section>

                  {/* INCLUSIONS */}
                  <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6">Inclusiones</h3>
                              <ul className="space-y-4">
                                  {(excursion.included || ["Chofer/Guía", "Peajes y Estacionamientos", "Aire acondicionado"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-3 text-slate-600">
                                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                          <span className="font-bold">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          <div>
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 text-red-400">Exclusiones</h3>
                              <ul className="space-y-4">
                                  {(excursion.notIncluded || ["Entradas opcionales", "Comidas", "Extras no mencionados"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-3 text-slate-400">
                                          <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                          <span className="font-medium italic">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </section>

                  {/* MEETING POINT & INFO */}
                  <section className="space-y-8">
                      <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                          <h3 className="text-lg font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             Punto de encuentro y Horarios
                          </h3>
                          <p className="text-blue-800 font-bold leading-relaxed whitespace-pre-line italic">
                              {excursion.meetingPoint || "A coordinar vía WhatsApp una vez realizada la reserva. Generalmente pick-up en puerta del hotel."}
                          </p>
                      </div>

                      <div>
                          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Información Relevante</h2>
                          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex gap-4">
                               <span className="text-2xl">⚡</span>
                               <div className="text-amber-900 font-bold leading-relaxed whitespace-pre-line">
                                   {excursion.importantInfo || "Se recomienda traer ropa liviana, protector solar y gorra.\nCancelaciones con al menos 24hs de anticipación."}
                               </div>
                          </div>
                      </div>
                  </section>
              </div>

              {/* BOOKING SIDEBAR */}
              <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-50 sticky top-24">
                      <div className="mb-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio por Persona</span>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-green-700 tracking-tighter">
                                  {formatPrice((excursion.providerPrice || 0) + (excursion.profitMargin || 0), excursion.baseCurrency)}
                              </span>
                          </div>
                      </div>

                      <div className="space-y-6 mb-8">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha Sugerida</label>
                              <input 
                                type="date" 
                                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-green-500 transition-all"
                                value={selectedDate}
                                onChange={(e)=>setSelectedDate(e.target.value)}
                              />
                          </div>

                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pasajeros</label>
                              <div className="flex border-2 border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                                  <button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">-</button>
                                  <span className="flex-1 text-center py-4 font-black text-xl bg-white text-slate-800">{passengers}</span>
                                  <button onClick={()=>setPassengers(passengers+1)} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">+</button>
                              </div>
                          </div>

                          <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black uppercase text-green-800">Monto del Servicio</span>
                                  <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">VALOR FINAL</span>
                              </div>
                              <div className="text-3xl font-black text-green-900 tracking-tighter">
                                  {formatPrice(totalPrice, excursion.baseCurrency)}
                              </div>
                              <p className="text-[9px] font-bold text-green-700 mt-2 uppercase tracking-widest italic leading-tight">Reserva hoy con una seña del 40%.</p>
                          </div>
                      </div>

                      <button 
                        onClick={handleAddToPlan}
                        className="w-full bg-green-600 text-white font-black py-6 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-95"
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
