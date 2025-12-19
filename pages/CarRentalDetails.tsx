
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCarById } from '../services/carRentalService';
import { CarRental } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import ImageGallery from '../components/ImageGallery';
import BookingModal from '../components/BookingModal';

const CarRentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarRental | undefined>(undefined);
  const [days, setDays] = useState(3);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) getCarById(id).then(setCar);
  }, [id]);

  if (!car) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const totalPrice = car.pricePerDay * days;

  const handleBookingClick = () => setIsBookingModalOpen(true);

  const handleConfirmWhatsApp = (data: any) => {
    const message = `*SOLICITUD ALQUILER DE COCHE - FLORIPA FÁCIL*\n\n` +
                    `🚗 *Vehículo:* ${car.brand} ${car.title}\n` +
                    `📅 *Días de Alquiler:* ${days}\n` +
                    `💰 *Total Estimado:* ${formatPrice(totalPrice, car.baseCurrency)}\n\n` +
                    `*DATOS DEL CLIENTE:*\n` +
                    `👤 ${data.firstName} ${data.lastName}\n` +
                    `🆔 DNI/Pass: ${data.dni}\n` +
                    `📧 ${data.email}\n` +
                    `📱 ${data.phone}`;
    
    window.open(`https://wa.me/5491140632644?text=${encodeURIComponent(message)}`, "_blank");
    setIsBookingModalOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold">{car.brand} {car.title}</h1><p className="text-xs text-gray-500 uppercase tracking-widest font-black text-green-600">{car.category}</p></div>
          <div className="text-right"><p className="text-xs text-gray-400 font-bold">Desde</p><p className="text-2xl font-black text-green-700">{formatPrice(car.pricePerDay, car.baseCurrency)}<span className="text-xs font-normal"> / día</span></p></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <ImageGallery images={car.images} title={`${car.brand} ${car.title}`} />
              
              <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8">
                  <div>
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Especificaciones Técnicas</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                              <span className="text-2xl mb-1">⚙️</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Transmisión</span>
                              <span className="font-bold text-sm">{car.transmission}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                              <span className="text-2xl mb-1">⛽</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Combustible</span>
                              <span className="font-bold text-sm">{car.fuel}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                              <span className="text-2xl mb-1">👥</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Pasajeros</span>
                              <span className="font-bold text-sm">{car.passengers}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center text-center">
                              <span className="text-2xl mb-1">🚪</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Puertas</span>
                              <span className="font-bold text-sm">{car.doors}</span>
                          </div>
                      </div>
                  </div>

                  <div>
                      <h3 className="font-bold text-lg mb-4">Capacidad de Equipaje</h3>
                      <div className="flex gap-6">
                          <div className="flex items-center gap-2"><span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">🧳</span> <div><p className="text-xs font-bold text-gray-400">Grandes</p><p className="font-black text-xl">{car.largeSuitcases}</p></div></div>
                          <div className="flex items-center gap-2"><span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">💼</span> <div><p className="text-xs font-bold text-gray-400">Chicas</p><p className="font-black text-xl">{car.smallSuitcases}</p></div></div>
                          {car.hasAC && <div className="flex items-center gap-2"><span className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">❄️</span> <p className="font-bold text-sm">Aire Acondicionado</p></div>}
                      </div>
                  </div>

                  <div>
                      <h3 className="font-bold text-lg mb-4">Descripción y Requisitos</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{car.description || 'Consulta los requisitos de licencia internacional y franquicia de seguridad para este vehículo.'}</p>
                  </div>
              </div>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border-t-8 border-green-600">
                  <h3 className="text-xl font-bold mb-6">Cotiza tu Alquiler</h3>
                  <div className="space-y-6 mb-8">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Días de Alquiler</label>
                          <div className="flex border rounded-xl overflow-hidden">
                              <button onClick={()=>setDays(Math.max(1, days-1))} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border-r">-</button>
                              <input type="number" value={days} readOnly className="flex-1 text-center font-bold text-xl outline-none" />
                              <button onClick={()=>setDays(days+1)} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border-l">+</button>
                          </div>
                      </div>
                      <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                          <div className="flex justify-between items-center text-green-900">
                              <span className="text-sm font-bold">Total x {days} días</span>
                              <span className="text-2xl font-black">{formatPrice(totalPrice, car.baseCurrency)}</span>
                          </div>
                          <p className="text-[10px] text-green-600 mt-2 font-bold uppercase italic">* Incluye impuestos y seguro básico.</p>
                      </div>
                  </div>
                  <button onClick={handleBookingClick} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]">Solicitar Disponibilidad</button>
                  <p className="text-[10px] text-gray-400 text-center mt-4 uppercase font-bold tracking-widest">Entrega en Aeropuerto o Hotel</p>
              </div>
          </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={()=>setIsBookingModalOpen(false)} 
        title={`${car.brand} ${car.title}`}
        priceInfo={`Total x ${days} días: ${formatPrice(totalPrice, car.baseCurrency)}`}
        onConfirmWhatsApp={handleConfirmWhatsApp}
      />
    </div>
  );
};

export default CarRentalDetails;
