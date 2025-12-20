
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTripById } from '../services/tripService';
import { Trip } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getTripById(id).then(setTrip);
  }, [id]);

  if (!trip) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
    if (!selectedDate) {
        alert('Por favor selecciona una fecha de viaje.');
        return;
    }
    addItem(trip, guests, 1, selectedDate);
    setIsSelectionModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div>
              <h1 className="text-xl font-bold text-gray-800">{trip.title}</h1>
              <p className="text-gray-500 text-xs flex items-center mt-1">📍 {trip.location}</p>
          </div>
          <Link to="/trips" className="text-xs font-bold text-green-600 uppercase tracking-widest hover:underline">Volver a Tours</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <ImageGallery images={trip.images} title={trip.title} />
              <div className="bg-white p-8 rounded-3xl mt-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Detalle del Tour</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg mb-8">{trip.description}</p>
                  
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Próximas Salidas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {trip.availableDates.map((d,i)=>(
                          <button key={i} onClick={()=>setSelectedDate(d)} className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedDate === d ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-green-200'}`}>
                              <span className="font-bold text-gray-700 block">{d}</span>
                              <span className="text-[10px] text-green-600 font-bold uppercase">Lugar disponible</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24 border-t-8 border-green-600">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Precio por persona</p>
                      <p className="text-4xl font-black text-gray-900">{formatPrice(trip.price, trip.baseCurrency)}</p>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                      <div>
                          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Pasajeros</label>
                          <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden">
                              <button onClick={()=>setGuests(Math.max(1,guests-1))} className="px-5 py-3 bg-gray-50 hover:bg-gray-100 border-r-2 border-gray-100 transition-colors font-bold text-xl">-</button>
                              <span className="flex-1 text-center py-3 font-black text-xl bg-white">{guests}</span>
                              <button onClick={()=>setGuests(guests+1)} className="px-5 py-3 bg-gray-50 hover:bg-gray-100 border-l-2 border-gray-100 transition-colors font-bold text-xl">+</button>
                          </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100">
                          <div className="flex justify-between font-black text-green-900 text-lg mb-1">
                              <span>Total</span>
                              <span>{formatPrice(trip.price * guests, trip.baseCurrency)}</span>
                          </div>
                          <p className="text-[10px] text-green-600 font-bold uppercase">Reserva con el 40% ({formatPrice(trip.price * guests * 0.4, trip.baseCurrency)})</p>
                      </div>
                  </div>

                  <button onClick={handleAddToPlan} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Agregar a mi Plan
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-4 italic font-medium">Puedes sumar autos y excursiones antes de pagar.</p>
              </div>
          </div>
      </div>

      <SelectionModal 
        isOpen={isSelectionModalOpen} 
        onClose={() => setIsSelectionModalOpen(false)} 
        itemName={trip.title} 
      />
    </div>
  );
};

export default Details;
