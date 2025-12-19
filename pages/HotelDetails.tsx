
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotelById } from '../services/hotelService';
import { Hotel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { generateShareImage } from '../services/imageShareService';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Leaflet Icon Fix
if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSharingMenuOpen, setIsSharingMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
      getHotelById(id).then(setHotel);
    }
  }, [id]);

  const calculateDays = () => {
      if (!checkIn || !checkOut) return 0;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateDays();
  const totalPrice = hotel ? hotel.pricePerNight * nights : 0;
  const bookingFee = totalPrice * 0.10;

  const handleBookingClick = () => {
    if (!nights || nights <= 0) {
        alert("Por favor seleccione fechas válidas (mínimo 1 noche)");
        return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmWhatsApp = (passengerData: any) => {
    const message = `*SOLICITUD DE RESERVA DE HOTEL - ABRAS TRAVEL*\n\n` +
                    `🏨 *Hotel:* ${hotel?.title}\n` +
                    `📅 *Check-in:* ${checkIn}\n` +
                    `📅 *Check-out:* ${checkOut} (${nights} noches)\n` +
                    `💰 *Total:* ${formatPrice(totalPrice)}\n\n` +
                    `*DATOS DEL HUÉSPED:*\n` +
                    `👤 Nombre: ${passengerData.firstName} ${passengerData.lastName}\n` +
                    `🆔 DNI: ${passengerData.dni}\n` +
                    `📧 Email: ${passengerData.email}\n` +
                    `📱 Teléfono: ${passengerData.phone}\n\n` +
                    `🔗 Link: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/5491140632644?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingModalOpen(false);
  };

  const handleShareImage = async () => {
    if (!hotel) return;
    setIsGeneratingPdf(true);
    const itemForImage = { ...hotel, type: 'hotel' as const };
    await generateShareImage(itemForImage, formatPrice(hotel.pricePerNight));
    setIsGeneratingPdf(false);
    setIsSharingMenuOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = `Mira este hotel en ABRAS Travel: ${hotel?.title}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(hotel?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  if (!hotel) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight truncate max-w-[200px] md:max-w-md">{hotel.title}</h1>
                  <p className="text-gray-500 text-xs flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {hotel.location}
                  </p>
              </div>
              <div className="relative">
                  <button onClick={() => setIsSharingMenuOpen(!isSharingMenuOpen)} disabled={isGeneratingPdf} className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 flex items-center gap-2" title="Compartir">
                      {isGeneratingPdf ? (<svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>)}
                  </button>
                  {isSharingMenuOpen && (
                      <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsSharingMenuOpen(false)}></div>
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
                              <div className="p-2">
                                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-green-500 font-bold">WhatsApp</span></a>
                                  <a href={emailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-blue-500 font-bold">Email</span></a>
                                  <button onClick={handleShareImage} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors text-left"><span className="text-orange-500 font-bold">Descargar Flyer (JPG)</span></button>
                              </div>
                          </div>
                      </>
                  )}
              </div>
          </div>
      </div>
      
      <div className="relative w-full">
        <ImageGallery images={hotel.images} title={hotel.title} />
        <div className="absolute bottom-0 left-0 w-full p-8 pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">HOTEL & RESORT</span><div className="flex text-yellow-400 drop-shadow-md">{Array(hotel.stars).fill(0).map((_,i)=><span key={i} className="text-xl">★</span>)}</div></div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">{hotel.title}</h1>
            <p className="text-white/90 text-lg flex items-center drop-shadow-md"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{hotel.location}</p>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8`}>
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acerca del Alojamiento</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8 whitespace-pre-line">{hotel.description}</p>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><svg className="w-6 h-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>Servicios y Comodidades</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                {hotel.amenities.map((amenity, idx) => (<div key={idx} className="flex items-start text-gray-700"><svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-sm font-medium">{amenity}</span></div>))}
            </div>
          </div>

          {/* MAP SECTION */}
          {hotel.lat && hotel.lng && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-4 border-b">
                      <h3 className="text-xl font-bold text-gray-800">Ubicación en el Mapa</h3>
                  </div>
                  <div className="h-[400px] w-full z-0">
                      <MapContainer center={[hotel.lat, hotel.lng]} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[hotel.lat, hotel.lng]}>
                              <Popup>{hotel.title}</Popup>
                          </Marker>
                      </MapContainer>
                  </div>
              </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-xl p-6 sticky top-24 border border-blue-100">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-medium">Precio por noche</span>
              <div className="text-right">
                  {hotel.discount && (<span className="text-sm text-gray-400 line-through mr-2">{formatPrice(hotel.pricePerNight / (1 - hotel.discount/100))}</span>)}
                  <span className="text-3xl font-bold text-blue-700">{formatPrice(hotel.pricePerNight)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-4">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in</label><input type="date" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out</label><input type="date" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
              </div>
              {nights > 0 && (<div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm mt-4 border border-blue-100"><div className="flex justify-between text-gray-700"><span>{formatPrice(hotel.pricePerNight)} x {nights} noches</span><span>{formatPrice(totalPrice)}</span></div><div className="flex justify-between font-bold text-orange-600 pt-2 border-t border-blue-200 mt-2"><span>Reserva (10%)</span><span>{formatPrice(bookingFee)}</span></div><p className="text-xs text-gray-400 mt-1 italic">El saldo restante se abona al llegar a la propiedad.</p></div>)}
              <button onClick={handleBookingClick} disabled={nights <= 0} className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 mt-4 transform hover:-translate-y-1">{nights > 0 ? 'Continuar Reserva' : 'Selecciona Fechas'}</button>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title={hotel.title}
        priceInfo={`Total x ${nights} noches: ${formatPrice(totalPrice)}`}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default HotelDetails;
