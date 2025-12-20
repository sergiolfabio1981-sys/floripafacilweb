
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCarById } from '../services/carRentalService';
import { CarRental } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';

const CarRentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarRental | undefined>(undefined);
  const [days, setDays] = useState(3);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getCarById(id).then(setCar);
  }, [id]);

  if (!car) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
    addItem(car, 1, days); // quantity 1 auto, x días
    setIsSelectionModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold">{car.brand} {car.title}</h1><p className="text-xs text-gray-500 uppercase tracking-widest font-black text-green-600">{car.category}</p></div>
          <Link to="/cars" className="text-xs font-bold text-green-600 uppercase hover:underline">Ver todos los autos</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <ImageGallery images={car.images} title={`${car.brand} ${car.title}`} />
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Especificaciones</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl text-center"><span className="text-2xl block mb-1">⚙️</span><span className="text-[10px] font-bold text-gray-400 uppercase">Transmisión</span><span className="font-bold text-sm block">{car.transmission}</span></div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center"><span className="text-2xl block mb-1">⛽</span><span className="text-[10px] font-bold text-gray-400 uppercase">Combustible</span><span className="font-bold text-sm block">{car.fuel}</span></div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center"><span className="text-2xl block mb-1">👥</span><span className="text-[10px] font-bold text-gray-400 uppercase">Pasajeros</span><span className="font-bold text-sm block">{car.passengers}</span></div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center"><span className="text-2xl block mb-1">❄️</span><span className="text-[10px] font-bold text-gray-400 uppercase">Clima</span><span className="font-bold text-sm block">{car.hasAC ? 'Aire' : 'No'}</span></div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{car.description || 'Auto ideal para tus vacaciones en Brasil. Entrega inmediata en aeropuerto o hotel.'}</p>
              </div>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border-t-8 border-green-600">
                  <h3 className="text-xl font-bold mb-6">Configura tu Alquiler</h3>
                  <div className="space-y-6 mb-8">
                      <div>
                          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Días de Alquiler</label>
                          <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden">
                              <button onClick={()=>setDays(Math.max(1, days-1))} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border-r-2 border-gray-100 font-bold text-xl">-</button>
                              <input type="number" value={days} readOnly className="flex-1 text-center font-black text-xl outline-none" />
                              <button onClick={()=>setDays(days+1)} className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border-l-2 border-gray-100 font-bold text-xl">+</button>
                          </div>
                      </div>
                      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                          <div className="flex justify-between items-center text-green-900 font-black text-lg">
                              <span>Subtotal</span>
                              <span>{formatPrice(car.pricePerDay * days, car.baseCurrency)}</span>
                          </div>
                          <p className="text-[10px] text-green-600 mt-1 font-bold uppercase">Reserva hoy con el 40%</p>
                      </div>
                  </div>
                  <button onClick={handleAddToPlan} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Agregar a mi Plan
                  </button>
              </div>
          </div>
      </div>
      <SelectionModal isOpen={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} itemName={`${car.brand} ${car.title}`} />
    </div>
  );
};

export default CarRentalDetails;
