
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupTripById } from '../services/groupService';
import { GroupTrip } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { generateShareImage } from '../services/imageShareService';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<GroupTrip | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'dates' | 'services'>('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharingMenuOpen, setIsSharingMenuOpen] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
      getGroupTripById(id).then(setTrip);
    }
  }, [id]);

  if (!trip) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div></div>;

  const baseCurrency = trip.baseCurrency || 'ARS';
  const basePrice = trip.price * guests;
  const bookingFee = basePrice * 0.10;

  const handleBookingClick = () => {
    if (!selectedDate) {
        alert("Seleccione una fecha de salida");
        return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmWhatsApp = (passengerData: any) => {
    const message = `*RESERVA GRUPAL - FLORIPA FÁCIL*\n\n` +
                    `🚌 *Viaje:* ${trip.title}\n` +
                    `📅 *Salida:* ${selectedDate}\n` +
                    `👥 *Pasajeros:* ${guests}\n` +
                    `💰 *Total:* ${formatPrice(basePrice, baseCurrency)}\n\n` +
                    `*DATOS DEL PASAJERO:*\n` +
                    `👤 ${passengerData.firstName} ${passengerData.lastName}\n` +
                    `🆔 ${passengerData.dni}\n` +
                    `📍 ${passengerData.city}\n` +
                    `📧 ${passengerData.email}\n\n` +
                    `🔗 Link: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/5491140632644?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingModalOpen(false);
  };

  const handleShareImage = async () => {
      setIsGeneratingPdf(true);
      const itemForImage = { ...trip, type: 'group' as const };
      await generateShareImage(itemForImage, formatPrice(trip.price, baseCurrency));
      setIsGeneratingPdf(false);
      setIsSharingMenuOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = `Mira este Viaje Grupal en Floripa Fácil: ${trip?.title}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(trip?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div><h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{trip.title}</h1><p className="text-gray-500 text-sm flex items-center mt-1"><svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Salida Grupal a {trip.location}</p></div>
              <div className="relative">
                  <button onClick={() => setIsSharingMenuOpen(!isSharingMenuOpen)} disabled={isGeneratingPdf} className="p-2 rounded-full hover:bg-gray-100"><svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                  {isSharingMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsSharingMenuOpen(false)}></div><div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border z-50 p-2"><a href={whatsappUrl} target="_blank" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm text-green-600 font-bold">WhatsApp</a><a href={emailUrl} target="_blank" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm text-blue-600 font-bold">Email</a><button onClick={handleShareImage} className="block w-full text-left px-4 py-2 hover:bg-orange-100 rounded text-sm text-orange-600 font-bold">Descargar Flyer (JPG)</button></div></>)}
              </div>
          </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <div className="relative mb-6">
                <ImageGallery images={trip.images} title={trip.title} />
                <div className="absolute top-4 right-4 bg-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg z-10 pointer-events-none">GRUPAL</div>
              </div>
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto"><button onClick={()=>setActiveTab('overview')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='overview' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Resumen</button><button onClick={()=>setActiveTab('dates')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='dates' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Fechas Confirmadas</button><button onClick={()=>setActiveTab('services')} className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab==='services' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Incluye</button></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
                  {activeTab === 'overview' && (<div><h3 className="text-xl font-bold mb-4 text-gray-800">Sobre esta Experiencia Grupal</h3><p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{trip.description}</p></div>)}
                  {activeTab === 'dates' && (<div><h3 className="text-xl font-bold mb-4 text-gray-800">Fechas de Salida</h3>{trip.availableDates.length > 0 ? (<div className="space-y-3">{trip.availableDates.map((d,i)=>(<div key={i} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${selectedDate === d ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`} onClick={()=>setSelectedDate(d)}><span className="font-medium text-gray-700">{d}</span><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDate === d ? 'border-purple-600' : 'border-gray-300'}`}>{selectedDate === d && <div className="w-3 h-3 rounded-full bg-purple-600"></div>}</div></div>))}</div>) : <p className="text-gray-500 italic">Consultar próximas fechas.</p>}</div>)}
                  {activeTab === 'services' && (<div><h3 className="text-xl font-bold mb-4 text-gray-800">Servicios Incluidos</h3><ul className="grid grid-cols-1 md:grid-cols-2 gap-4">{trip.includesFlight && (<li className="flex items-center p-3 bg-gray-50 rounded-lg"><span className="text-green-600 mr-2">✈️</span> Aéreos</li>)}<li className="flex items-center p-3 bg-gray-50 rounded-lg"><span className="text-green-600 mr-2">🏨</span> Alojamiento</li><li className="flex items-center p-3 bg-gray-50 rounded-lg"><span className="text-green-600 mr-2">🚌</span> Traslados</li><li className="flex items-center p-3 bg-gray-50 rounded-lg"><span className="text-green-600 mr-2">🚩</span> Coordinador</li></ul></div>)}
              </div>
          </div>
          <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24 border-t-4 border-purple-600">
                  <div className="mb-6 pb-6 border-b border-gray-100"><p className="text-sm text-gray-500 font-medium">Precio por persona</p><div className="flex items-baseline gap-2 mt-1"><p className="text-4xl font-bold text-purple-900">{formatPrice(trip.price, baseCurrency)}</p></div></div>
                  <div className="space-y-5 mb-6"><div><label className="block text-xs font-bold text-gray-700 uppercase mb-2">Fecha</label><select className="w-full border p-3 rounded-lg bg-white" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}><option value="">Selecciona salida...</option>{trip.availableDates.map((d,i)=><option key={i} value={d}>{d}</option>)}</select></div><div><label className="block text-xs font-bold text-gray-700 uppercase mb-2">Pasajeros</label><div className="flex border rounded-lg overflow-hidden"><button onClick={()=>setGuests(Math.max(1,guests-1))} className="px-4 py-2 bg-gray-50 hover:bg-gray-100">-</button><span className="flex-1 text-center py-2 font-bold">{guests}</span><button onClick={()=>setGuests(guests+1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100">+</button></div></div></div>
                  <div className="bg-purple-50 p-4 rounded-lg mb-6"><div className="flex justify-between font-bold text-purple-900 text-lg"><span>Total</span><span>{formatPrice(basePrice, baseCurrency)}</span></div><div className="flex justify-between text-sm text-purple-700 mt-2"><span>Reserva (10%)</span><span className="font-bold">{formatPrice(bookingFee, baseCurrency)}</span></div></div>
                  <button onClick={handleBookingClick} disabled={!selectedDate} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg">{selectedDate ? 'Reservar Lugar' : 'Selecciona Fecha'}</button>
              </div>
          </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title={trip.title}
        priceInfo={`Total (${guests} pax): ${formatPrice(basePrice, baseCurrency)}`}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default GroupDetails;
