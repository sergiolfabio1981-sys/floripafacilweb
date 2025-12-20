
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRentalById } from '../services/rentalService';
import { Apartment } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';

const RentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<Apartment | undefined>(undefined);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getRentalById(id).then(setRental);
  }, [id]);

  const calculateNights = () => {
      if (!checkIn || !checkOut) return 0;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const nights = calculateNights();

  if (!rental) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
    if (!nights || nights <= 0) {
        alert("Seleccione fechas válidas (mínimo 1 noche)");
        return;
    }
    addItem(rental, 1, nights, `${checkIn} al ${checkOut}`);
    setIsSelectionModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold">{rental.title}</h1><p className="text-xs text-gray-500 font-bold">📍 {rental.location}</p></div>
          <Link to="/accommodations" className="text-xs font-bold text-green-600 uppercase hover:underline">Ver más casas</Link>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <ImageGallery images={rental.images} title={rental.title} />
              <div className="bg-white p-8 rounded-3xl mt-6 shadow-sm border border-gray-100">
                <div className="flex gap-6 mb-8 pb-6 border-b border-gray-50">
                    <div className="text-center"><span className="text-2xl block">🛌</span><span className="text-[10px] font-bold text-gray-400 uppercase">Cuartos</span><p className="font-black">{rental.bedrooms}</p></div>
                    <div className="text-center"><span className="text-2xl block">👥</span><span className="text-[10px] font-bold text-gray-400 uppercase">Huéspedes</span><p className="font-black">{rental.maxGuests}</p></div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">{rental.description}</p>
                <h3 className="text-lg font-bold mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {rental.amenities.map((a, i) => (<div key={i} className="flex items-center text-gray-500 gap-2 font-medium">✓ {a}</div>))}
                </div>
              </div>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border-t-8 border-green-600">
                  <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-50">
                      <span className="text-xs font-black text-gray-400 uppercase">Precio por noche</span>
                      <span className="text-3xl font-black text-gray-900">{formatPrice(rental.pricePerNight)}</span>
                  </div>
                  <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Entrada</label><input type="date" className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-bold" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
                          <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Salida</label><input type="date" className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm font-bold" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
                      </div>
                      {nights > 0 && (
                          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                              <div className="flex justify-between font-black text-green-900 mb-1">
                                  <span>Subtotal ({nights} noches)</span>
                                  <span>{formatPrice(rental.pricePerNight * nights)}</span>
                              </div>
                              <p className="text-[10px] text-green-600 font-bold uppercase italic">Reserva hoy con el 40%</p>
                          </div>
                      )}
                  </div>
                  <button onClick={handleAddToPlan} disabled={nights <= 0} className="w-full bg-green-600 disabled:bg-gray-100 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Agregar a mi Plan
                  </button>
              </div>
          </div>
      </div>
      <SelectionModal isOpen={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} itemName={rental.title} />
    </div>
  );
};

export default RentalDetails;
