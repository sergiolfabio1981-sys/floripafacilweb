
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExcursionById } from '../services/excursionService';
import { Excursion } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';
import ImageGallery from '../components/ImageGallery';
import SelectionModal from '../components/SelectionModal';

const ExcursionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [excursion, setExcursion] = useState<Excursion | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  
  const { formatPrice } = useCurrency();
  const { addItem } = usePlanner();

  useEffect(() => {
    if (id) getExcursionById(id).then(setExcursion);
  }, [id]);

  if (!excursion) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

  const handleAddToPlan = () => {
      if(!selectedDate) {
          alert("Seleccione una fecha preferida");
          return;
      }
      addItem(excursion, passengers, 1, selectedDate);
      setIsSelectionModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white shadow-sm border-b sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
          <div><h1 className="text-xl font-bold">{excursion.title}</h1><p className="text-xs text-gray-500 uppercase tracking-widest font-black text-green-600">Excursión / Traslado</p></div>
          <Link to="/excursions" className="text-xs font-bold text-green-600 uppercase hover:underline">Ver todas</Link>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <ImageGallery images={excursion.images} title={excursion.title} />
              <div className="bg-white p-8 rounded-3xl mt-6 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-4">Información del Servicio</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">{excursion.description}</p>
                  <div className="flex flex-wrap gap-4">
                      <span className="bg-slate-50 px-4 py-2 rounded-xl font-bold text-gray-500 border border-gray-100">Duración: {excursion.duration}</span>
                      <span className="bg-slate-50 px-4 py-2 rounded-xl font-bold text-gray-500 border border-gray-100">Salidas: {excursion.availableDates.join(', ')}</span>
                  </div>
              </div>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border-t-8 border-green-600">
                  <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-50">
                      <span className="text-xs font-black text-gray-400 uppercase">Precio por persona</span>
                      <span className="text-3xl font-black text-gray-900">{formatPrice(excursion.price)}</span>
                  </div>
                  
                  <div className="space-y-6 mb-8">
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Fecha Preferida</label><input type="date" className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-green-600" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} /></div>
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Pasajeros</label>
                          <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden">
                              <button onClick={()=>setPassengers(Math.max(1, passengers-1))} className="px-5 py-3 bg-gray-50 hover:bg-gray-100 border-r-2 border-gray-100 font-bold text-xl">-</button>
                              <span className="flex-1 text-center py-3 font-black text-xl">{passengers}</span>
                              <button onClick={()=>setPassengers(passengers+1)} className="px-5 py-3 bg-gray-50 hover:bg-gray-100 border-l-2 border-gray-100 font-bold text-xl">+</button>
                          </div>
                      </div>
                      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 flex justify-between items-center">
                          <span className="font-black text-green-900">Total</span>
                          <span className="text-xl font-black text-green-700">{formatPrice(excursion.price * passengers)}</span>
                      </div>
                  </div>
                  <button onClick={handleAddToPlan} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Agregar a mi Plan
                  </button>
              </div>
          </div>
      </div>
      <SelectionModal isOpen={isSelectionModalOpen} onClose={() => setIsSelectionModalOpen(false)} itemName={excursion.title} />
    </div>
  );
};

export default ExcursionDetails;
