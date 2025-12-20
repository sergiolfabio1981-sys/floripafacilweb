
import React, { useState, useEffect } from 'react';
import { getInstallmentTrips } from '../services/installmentService';
import { InstallmentTrip } from '../types';
import TripCard from '../components/TripCard';

const Installments: React.FC = () => {
  const [trips, setTrips] = useState<InstallmentTrip[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getInstallmentTrips();
        setTrips(data.map(t => ({...t, type: 'installment' as const})));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-indigo-900 py-16 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <h1 className="text-4xl md:text-5xl font-bold mb-4">Floripa Cuotas: Viajá sin interés</h1>
                 <p className="text-xl text-indigo-100 mb-6">Congela el precio hoy y paga mes a mes sin interés hasta la fecha de salida.</p>
                 <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
                     <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">📅 Elige tu destino 2026/2027</div>
                     <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">➗ Divide el total en meses</div>
                     <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20">✈️ ¡Viaja sin deudas!</div>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {trips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                ))}
            </div>
            
            {trips.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">Actualmente no hay opciones de Floripa Cuotas activas.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Installments;
