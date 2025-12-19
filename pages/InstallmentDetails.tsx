
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInstallmentTripById } from '../services/installmentService';
import { InstallmentTrip } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { generateShareImage } from '../services/imageShareService';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';

const InstallmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<InstallmentTrip | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  const [isSharingMenuOpen, setIsSharingMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
      getInstallmentTripById(id).then(setTrip);
    }
  }, [id]);

  // Installment Calculation
  const now = new Date();
  const depDate = trip ? new Date(trip.departureDate) : new Date();
  const diffMonths = (depDate.getFullYear() - now.getFullYear()) * 12 + (depDate.getMonth() - now.getMonth());
  const monthsCount = diffMonths > 0 ? diffMonths : 1; 

  const totalPrice = trip ? trip.totalPrice * passengers : 0;
  const installmentValue = totalPrice / monthsCount;

  // --- SHARE LOGIC ---
  const handleShareImage = async () => {
    if (!trip) return;
    setIsGeneratingPdf(true);
    const itemForImage = { ...trip, type: 'installment' as const };
    await generateShareImage(itemForImage, formatPrice(trip.totalPrice));
    setIsGeneratingPdf(false);
    setIsSharingMenuOpen(false);
  };

  const shareUrl = window.location.href;
  const shareText = `Mira este Plan de Cuotas en ABRAS Travel: ${trip?.title}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(trip?.title || '')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  const handleBookingClick = () => {
      setIsBookingModalOpen(true);
  };

  const handleConfirmWhatsApp = (passengerData: any) => {
    const message = `*PLAN ABRAS CUOTAS - SOLICITUD*\n\n` +
                    `📦 *Plan:* ${trip?.title}\n` +
                    `👥 *Pasajeros:* ${passengers}\n` +
                    `💳 *Cuota Estimada:* ${formatPrice(installmentValue)} (${monthsCount} cuotas)\n\n` +
                    `*DATOS:* ${passengerData.firstName} ${passengerData.lastName} - DNI ${passengerData.dni}\n` +
                    `📧 ${passengerData.email}\n` +
                    `🔗 Link: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/5491140632644?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingModalOpen(false);
  };

  if (!trip) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div><h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight truncate max-w-[200px] md:max-w-md">{trip.title}</h1><p className="text-gray-500 text-xs flex items-center mt-1"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{trip.location}</p></div>
                <div className="relative">
                    <button onClick={() => setIsSharingMenuOpen(!isSharingMenuOpen)} disabled={isGeneratingPdf} className="p-2 md:p-3 rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 flex items-center gap-2" title="Compartir">
                        {isGeneratingPdf ? (<svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>)}
                    </button>
                    {isSharingMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsSharingMenuOpen(false)}></div><div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up"><div className="p-2"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-green-500 font-bold">WhatsApp</span></a><a href={emailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors" onClick={()=>setIsSharingMenuOpen(false)}><span className="text-blue-500 font-bold">Email</span></a><button onClick={handleShareImage} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors text-left"><span className="text-orange-500 font-bold">Descargar Flyer (JPG)</span></button></div></div></>)}
                </div>
            </div>
        </div>
        
        <div className="relative w-full">
             <ImageGallery images={trip.images} title={trip.title} />
             <div className="absolute bottom-0 left-0 w-full p-8 pointer-events-none bg-gradient-to-t from-indigo-900/90 to-transparent">
                 <div className="max-w-7xl mx-auto w-full text-white">
                     <span className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded font-bold mb-2 inline-block shadow">SALIDA: {trip.departureDate}</span>
                     <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">{trip.title}</h1>
                     <p className="text-xl opacity-90">{trip.location}</p>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalles de ABRAS Cuotas</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{trip.description}</p>
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left"><p className="text-indigo-900 font-bold text-lg">Financiación Propia</p><p className="text-indigo-700 text-sm">Sin bancos, sin intereses ocultos.</p></div>
                        <div className="text-3xl font-bold text-indigo-600">{monthsCount} CUOTAS</div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border-t-4 border-indigo-600">
                    <h3 className="text-xl font-bold mb-6 text-center">Calculadora de Cuotas</h3>
                    <div className="mb-4"><label className="block text-sm font-bold text-gray-500 mb-1">Pasajeros</label><div className="flex border rounded"><button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="px-4 py-2 hover:bg-gray-100">-</button><span className="flex-1 text-center py-2 font-bold">{passengers}</span><button onClick={()=>setPassengers(passengers+1)} className="px-4 py-2 hover:bg-gray-100">+</button></div></div>
                    <div className="space-y-3 py-4 border-t border-b border-gray-100">
                        <div className="flex justify-between text-gray-600"><span>Precio Total ({passengers} pax)</span><span>{formatPrice(totalPrice)}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Meses hasta salida</span><span>{monthsCount} meses</span></div>
                        <div className="flex justify-between text-xl font-bold text-indigo-600 pt-2"><span>Valor Cuota Mensual</span><span>{formatPrice(installmentValue)}</span></div>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-2 mb-4">Abonando la 1ra cuota hoy congelas el precio total.</p>
                    <button onClick={handleBookingClick} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">Pagar 1ra Cuota y Reservar</button>
                </div>
            </div>
        </div>

        <BookingModal 
            isOpen={isBookingModalOpen} 
            onClose={() => setIsBookingModalOpen(false)}
            title={trip.title}
            priceInfo={`1ra Cuota (${passengers} pax): ${formatPrice(installmentValue)}`}
            onConfirmWhatsApp={handleConfirmWhatsApp}
        />
    </div>
  );
};

export default InstallmentDetails;
