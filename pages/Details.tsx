
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { Trip } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { generateShareImage } from '../services/imageShareService';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'dates' | 'services'>('overview');
  
  // Booking Logic
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharingMenuOpen, setIsSharingMenuOpen] = useState(false);
  
  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
        getTripById(id).then(data => setTrip(data));
    }
  }, [id]);

  if (!trip) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div></div>;

  const baseCurrency = trip.baseCurrency || 'ARS';
  const basePrice = trip.price * guests;
  const bookingFee = basePrice * 0.10;

  const handleBookingClick = () => {
      if (!selectedDate) {
          alert('Por favor selecciona una fecha de viaje.');
          return;
      }
      setIsBookingModalOpen(true);
  };

  const handleConfirmWhatsApp = (passengerData: any) => {
    const message = `*SOLICITUD DE RESERVA - ABRAS TRAVEL*\n\n` +
                    `📦 *Paquete:* ${trip.title}\n` +
                    `📅 *Fecha:* ${selectedDate}\n` +
                    `👥 *Pasajeros:* ${guests}\n` +
                    `💰 *Total Estimado:* ${formatPrice(basePrice, baseCurrency)}\n\n` +
                    `*DATOS DEL PASAJERO:*\n` +
                    `👤 Nombre: ${passengerData.firstName} ${passengerData.lastName}\n` +
                    `🆔 DNI: ${passengerData.dni} (Edad: ${passengerData.age})\n` +
                    `📍 Dirección: ${passengerData.address}, ${passengerData.city}, ${passengerData.province}, ${passengerData.country}\n` +
                    `📧 Email: ${passengerData.email}\n` +
                    `📱 Teléfono: ${passengerData.phone}\n\n` +
                    `🔗 Link: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/5491140632644?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingModalOpen(false);
  };

  const handleShareImage = async () => {
      setIsGeneratingPdf(true);
      const itemForImage = { ...trip, type: 'trip' as const };
      await generateShareImage(itemForImage, formatPrice(trip.price, baseCurrency));
      setIsGeneratingPdf(false);
      setIsSharingMenuOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = `Mira este paquete en ABRAS Travel: ${trip?.title}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(trip?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{trip.title}</h1>
                  <p className="text-gray-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {trip.location}
                  </p>
              </div>
              
              {/* Share Icon Button */}
              <div className="relative">
                  <button onClick={() => setIsSharingMenuOpen(!isSharingMenuOpen)} disabled={isGeneratingPdf} className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 flex items-center gap-2" title="Compartir">
                      {isGeneratingPdf ? (<svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>)}
                  </button>
                  {isSharingMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsSharingMenuOpen(false)}></div><div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up"><div className="p-2"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-green-500 font-bold">WhatsApp</span></a><a href={emailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-blue-500 font-bold">Email</span></a><button onClick={handleShareImage} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors text-left"><span className="text-orange-500 font-bold">Descargar Flyer (JPG)</span></button></div></div></>)}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
              <div className="relative mb-6">
                <ImageGallery images={trip.images} title={trip.title} />
                {trip.discount && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg z-10 pointer-events-none">
                        {trip.discount}% OFF
                    </div>
                )}
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                  <button onClick={()=>setActiveTab('overview')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='overview' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Resumen</button>
                  <button onClick={()=>setActiveTab('dates')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='dates' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Fechas y Precios</button>
                  <button onClick={()=>setActiveTab('services')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='services' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Servicios</button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                  {activeTab === 'overview' && (
                      <div className="animate-fade-in">
                          <h3 className="text-xl font-bold mb-4 text-gray-800">Detalle del Paquete</h3>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{trip.description}</p>
                      </div>
                  )}
                  {activeTab === 'dates' && (
                      <div className="animate-fade-in">
                          <h3 className="text-xl font-bold mb-4 text-gray-800">Próximas Salidas</h3>
                          {trip.availableDates.length > 0 ? (
                              <div className="space-y-3">
                                  {trip.availableDates.map((d,i)=>(
                                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer transition-all" onClick={()=>setSelectedDate(d)}>
                                          <div className="flex items-center gap-3">
                                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                              <span className="font-medium text-gray-700">{d}</span>
                                          </div>
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDate === d ? 'border-cyan-600' : 'border-gray-300'}`}>
                                              {selectedDate === d && <div className="w-3 h-3 rounded-full bg-cyan-600"></div>}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-500 italic">No hay fechas específicas cargadas. Consulta disponibilidad.</p>
                          )}
                      </div>
                  )}
                  {activeTab === 'services' && (
                      <div className="animate-fade-in">
                          <h3 className="text-xl font-bold mb-4 text-gray-800">Lo que incluye tu viaje</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {trip.includesFlight && (
                                <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">✈️</span> 
                                    <span className="text-gray-700 font-medium">Aéreos Ida y Vuelta</span>
                                </li>
                              )}
                              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">🏨</span> 
                                  <span className="text-gray-700 font-medium">Alojamiento Seleccionado</span>
                              </li>
                              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">🚌</span> 
                                  <span className="text-gray-700 font-medium">Traslados In/Out</span>
                              </li>
                              <li className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">🛡️</span> 
                                  <span className="text-gray-700 font-medium">Asistencia al Viajero</span>
                              </li>
                          </ul>
                      </div>
                  )}
              </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                      <p className="text-sm text-gray-500 font-medium">Precio final por persona</p>
                      <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-4xl font-bold text-gray-900">{formatPrice(trip.price, baseCurrency)}</p>
                      </div>
                      <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded">Impuestos y Tasas Incluidos</p>
                  </div>

                  <div className="space-y-5 mb-6">
                      <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Fecha de Viaje</label>
                          <select className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}>
                              <option value="">Selecciona una fecha...</option>
                              {trip.availableDates.map((d,i)=><option key={i} value={d}>{d}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Pasajeros</label>
                          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                              <button onClick={()=>setGuests(Math.max(1,guests-1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 transition-colors">-</button>
                              <span className="flex-1 text-center py-2 font-bold bg-white text-gray-800 flex items-center justify-center">{guests}</span>
                              <button onClick={()=>setGuests(guests+1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 transition-colors">+</button>
                          </div>
                      </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between font-bold text-blue-900 text-lg">
                          <span>Total Estimado</span>
                          <span>{formatPrice(basePrice, baseCurrency)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-blue-700 mt-2 pt-2 border-t border-blue-200">
                          <span>Reserva hoy (10%)</span>
                          <span className="font-bold">{formatPrice(bookingFee, baseCurrency)}</span>
                      </div>
                  </div>

                  <button 
                    onClick={handleBookingClick} 
                    className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/30 transform active:scale-95"
                  >
                      {selectedDate ? 'Reservar Ahora' : 'Selecciona Fecha'}
                  </button>
                  
                  <div className="mt-4 flex justify-center gap-2">
                      <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 opacity-70" alt="Visa" />
                      <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 opacity-70" alt="Mastercard" />
                      <img src="https://img.icons8.com/color/48/000000/mercado-pago.png" className="h-6 opacity-70" alt="MercadoPago" />
                  </div>
              </div>
          </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title={trip.title}
        priceInfo={`Total Estimado: ${formatPrice(basePrice, baseCurrency)}`}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default Details;
