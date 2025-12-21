
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
          alert("Seleccione la fecha de su arribo/partida");
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

  const totalPrice = ((excursion.providerPrice || 0) + (excursion.profitMargin || 0)) * (passengers > 4 ? Math.ceil(passengers/4) : 1);

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
                  <span className="bg-lime-100 text-lime-700 text-[10px] font-black px-2 py-1 rounded">TRABAJAMOS POR TU TRANQUILIDAD</span>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic mb-2">{excursion.title}</h1>
              <p className="text-gray-500 font-medium flex items-center gap-2 uppercase tracking-widest text-xs">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {excursion.location} — Servicio de Puerta a Puerta
              </p>
          </div>

          <ImageGallery images={excursion.images} title={excursion.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 relative">
              <div className="lg:col-span-2 space-y-12">
                  {/* TRANSFER FEATURES BAR */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🏁</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Punto de Encuentro</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">Zona de Arribos</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🧳</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Equipaje</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">4 Maletas Grandes</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">❄️</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Climatización</span>
                          <span className="font-bold text-slate-700 text-xs mt-1">Aire Acondicionado</span>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🤝</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meet & Greet</span>
                          <span className="font-bold text-green-600 text-xs mt-1">Cartel Incluido</span>
                      </div>
                  </div>

                  {/* PROMISE SECTION */}
                  <section className="bg-green-50 p-8 rounded-[3rem] border border-green-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                      <div className="flex-shrink-0 w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-lg border-4 border-lime-400 overflow-hidden">
                        <img src="https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-center md:text-left">
                          <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter italic mb-3">La diferencia Floripa Fácil</h2>
                          <p className="text-green-800/80 font-medium leading-relaxed">
                            No somos solo un transporte. Somos tu primer contacto con Brasil. Al reservar con nosotros, aseguras que un vehículo inspeccionado y un chofer profesional te estén esperando exactamente en el momento de tu llegada, sin filas ni esperas.
                          </p>
                      </div>
                  </section>

                  {/* HIGHLIGHTS */}
                  <section>
                      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic mb-8">¿Qué incluye este servicio?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                              {t: "Monitoreo de vuelo", d: "Si tu vuelo se adelanta o retrasa, ajustamos la recogida sin costo."},
                              {t: "Espera de cortesía", d: "Incluimos 60 minutos de espera gratuita desde el aterrizaje."},
                              {t: "Tarifa Final Cerrada", d: "No pagas peajes ni estacionamiento. Todo está incluido en el precio."},
                              {t: "Seguro de Pasajero", d: "Todos nuestros traslados cuentan con cobertura integral."},
                              {t: "Cartel de Bienvenida", d: "Chofer identificado con tu nombre para un encuentro rápido."},
                              {t: "Asistencia 24/7", d: "Línea directa por WhatsApp ante cualquier duda en tu llegada."}
                          ].map((h, i) => (
                              <div key={i} className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-slate-100 hover:border-lime-400 transition-colors group shadow-sm">
                                  <div className="w-10 h-10 rounded-2xl bg-lime-100 text-green-700 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all">✓</div>
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
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic mb-6">Detalles Técnicos</h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg">
                          {excursion.description}
                      </div>
                  </section>

                  {/* INCLUSIONS BOX */}
                  <section className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                          <div>
                              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8 text-lime-400">Totalmente Incluido</h3>
                              <ul className="space-y-5">
                                  {(excursion.included || ["Chofer Profesional", "Seguro APP", "Peajes", "AC"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-4">
                                          <div className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs">✓</div>
                                          <span className="font-bold text-sm uppercase tracking-widest">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          <div className="opacity-60">
                              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-8">No Incluye</h3>
                              <ul className="space-y-5">
                                  {(excursion.notIncluded || ["Propinas", "Servicios de Botones", "Traslados no detallados"]).map((item, i) => (
                                      <li key={i} className="flex items-center gap-4">
                                          <div className="w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs">×</div>
                                          <span className="font-bold text-sm uppercase tracking-widest">{item}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </section>

                  {/* IMPORTANT INFO */}
                  <section>
                      <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 space-y-6">
                          <div className="flex gap-4">
                              <span className="text-2xl shrink-0">⚠️</span>
                              <div>
                                  <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest mb-1 italic">Política de Reclamos</p>
                                  <div className="text-amber-900 leading-relaxed font-bold whitespace-pre-line text-sm">
                                      {excursion.importantInfo || "En caso de no visualizar al chofer, por favor contactar inmediatamente al WhatsApp de Emergencia (+54 9 11 4063 2644) antes de tomar otro transporte externo. Floripa Fácil no reembolsará servicios de terceros si no se contactó previamente a nuestro equipo."}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
              </div>

              {/* BOOKING SIDEBAR */}
              <div className="lg:col-span-1">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-50 sticky top-24">
                      <div className="mb-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión por Trayecto</span>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-green-700 tracking-tighter">
                                  {formatPrice((excursion.providerPrice || 0) + (excursion.profitMargin || 0), excursion.baseCurrency)}
                              </span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">* Precio por vehículo (Hasta 4 pax)</p>
                      </div>

                      <div className="space-y-6 mb-8">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Arribo / Partida</label>
                              <input 
                                type="date" 
                                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-green-500 transition-all appearance-none"
                                value={selectedDate}
                                onChange={(e)=>setSelectedDate(e.target.value)}
                              />
                          </div>

                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Cantidad de Pasajeros</label>
                              <div className="flex border-2 border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                                  <button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">-</button>
                                  <span className="flex-1 text-center py-4 font-black text-xl bg-white text-slate-800">{passengers}</span>
                                  <button onClick={()=>setPassengers(passengers+1)} className="px-6 py-4 hover:bg-slate-200 transition-colors font-black text-xl text-slate-600">+</button>
                              </div>
                              {passengers > 4 && <p className="text-[9px] text-orange-600 font-black uppercase mt-2 text-center tracking-widest">⚠️ Requiere vehículo extra o Van</p>}
                          </div>

                          <div className="bg-green-50 p-6 rounded-[2.5rem] border-2 border-green-100">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-black uppercase text-green-800">Total a Abonar</span>
                                  <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">FINAL</span>
                              </div>
                              <div className="text-3xl font-black text-green-900 tracking-tighter">
                                  {formatPrice(totalPrice, excursion.baseCurrency)}
                              </div>
                              <p className="text-[9px] font-bold text-green-700 mt-2 uppercase tracking-widest italic leading-tight">Incluye todos los cargos y seguros.</p>
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
