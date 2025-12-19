
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getExcursionById } from '../services/excursionService';
import { Excursion } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { generateShareImage } from '../services/imageShareService';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';

const ExcursionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [excursion, setExcursion] = useState<Excursion | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [isSharingMenuOpen, setIsSharingMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
      getExcursionById(id).then(setExcursion);
    }
  }, [id]);

  const totalPrice = excursion ? excursion.price * passengers : 0;
  const bookingFee = totalPrice * 0.10;

  const handleBookingClick = () => {
      if(!selectedDate) {
          alert("Seleccione una fecha");
          return;
      }
      setIsBookingModalOpen(true);
  };

  const handleConfirmWhatsApp = (passengerData: any) => {
    const message = `*SOLICITUD DE EXCURSIÓN - ABRAS TRAVEL*\n\n` +
                    `🎒 *Excursión:* ${excursion?.title}\n` +
                    `📅 *Fecha:* ${selectedDate}\n` +
                    `👥 *Pasajeros:* ${passengers}\n` +
                    `💰 *Total:* ${formatPrice(totalPrice)}\n\n` +
                    `*DATOS DE CONTACTO:*\n` +
                    `👤 Nombre: ${passengerData.firstName} ${passengerData.lastName}\n` +
                    `🆔 DNI: ${passengerData.dni}\n` +
                    `📧 Email: ${passengerData.email}\n` +
                    `🔗 Link: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/5491140632644?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingModalOpen(false);
  };

  const handleShareImage = async () => {
    if (!excursion) return;
    setIsGeneratingPdf(true);
    const itemForImage = { ...excursion, type: 'excursion' as const };
    await generateShareImage(itemForImage, formatPrice(excursion.price));
    setIsGeneratingPdf(false);
    setIsSharingMenuOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = `Mira esta excursión en ABRAS Travel: ${excursion?.title}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(excursion?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  if (!excursion) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div></div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div><h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight truncate max-w-[200px] md:max-w-md">{excursion.title}</h1><p className="text-gray-500 text-xs flex items-center mt-1"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{excursion.location}</p></div>
              <div className="relative">
                  <button onClick={() => setIsSharingMenuOpen(!isSharingMenuOpen)} disabled={isGeneratingPdf} className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 flex items-center gap-2" title="Compartir">
                      {isGeneratingPdf ? (<svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>)}
                  </button>
                  {isSharingMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsSharingMenuOpen(false)}></div><div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up"><div className="p-2"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-green-500 font-bold">WhatsApp</span></a><a href={emailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-blue-500 font-bold">Email</span></a><button onClick={handleShareImage} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors text-left"><span className="text-orange-500 font-bold">Descargar Flyer (JPG)</span></button></div></div></>)}
              </div>
          </div>
      </div>
      
      <div className="relative w-full">
          <ImageGallery images={excursion.images} title={excursion.title} />
          <div className="absolute bottom-0 left-0 w-full p-8 pointer-events-none bg-gradient-to-t from-black/80 to-transparent"><div className="max-w-7xl mx-auto w-full"><span className="bg-green-600 text-white px-2 py-1 text-sm font-bold rounded mb-2 inline-block shadow">EXCURSIÓN</span><h1 className="text-4xl font-bold text-white drop-shadow-md">{excursion.title}</h1><p className="text-white text-lg drop-shadow-md">{excursion.location}</p></div></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2"><div className="bg-white p-6 rounded-xl shadow-sm mb-6"><h2 className="text-2xl font-bold mb-4">Descripción</h2><p className="text-gray-600 mb-4">{excursion.description}</p><div className="flex gap-4 text-sm font-bold text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded">Duración: {excursion.duration}</span><span className="bg-gray-100 px-3 py-1 rounded">Salidas: {excursion.availableDates.join(', ')}</span></div></div></div>
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
                <div className="flex justify-between items-end mb-4"><span className="text-gray-500">Precio x persona</span><span className="text-2xl font-bold text-cyan-600">{formatPrice(excursion.price)}</span></div>
                <div className="mb-4"><label className="block text-sm font-bold mb-1">Fecha Preferida</label><input type="date" className="w-full border rounded p-2" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} /></div>
                <div className="mb-4"><label className="block text-sm font-bold mb-1">Cantidad de Personas</label><div className="flex items-center border rounded"><button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="p-2 px-4 hover:bg-gray-100">-</button><span className="flex-1 text-center font-bold">{passengers}</span><button onClick={()=>setPassengers(passengers+1)} className="p-2 px-4 hover:bg-gray-100">+</button></div></div>
                <div className="border-t pt-4 mb-4 space-y-2"><div className="flex justify-between text-sm"><span>Total</span><span>{formatPrice(totalPrice)}</span></div><div className="flex justify-between font-bold text-orange-600"><span>Reserva (10%)</span><span>{formatPrice(bookingFee)}</span></div></div>
                <button onClick={handleBookingClick} disabled={!selectedDate} className="w-full bg-cyan-600 text-white font-bold py-3 rounded hover:bg-cyan-700 disabled:bg-gray-300">Reservar Lugar</button>
            </div>
          </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title={excursion.title}
        priceInfo={`Total (${passengers} pax): ${formatPrice(totalPrice)}`}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default ExcursionDetails;
