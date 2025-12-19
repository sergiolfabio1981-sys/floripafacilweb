
import React, { useState, useEffect } from 'react';
import { getWorldCupTrips } from '../services/worldCupService';
import { WorldCupTrip } from '../types';
import TripCard from '../components/TripCard';

const WorldCup: React.FC = () => {
  const [trips, setTrips] = useState<WorldCupTrip[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getWorldCupTrips();
        setTrips(data.map(t => ({...t, type: 'worldcup' as const})));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-blue-900 via-sky-800 to-emerald-800 py-16 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <h1 className="text-4xl md:text-6xl font-black mb-4 italic">MUNDIAL 2026</h1>
                 <p className="text-xl text-blue-100 mb-6 font-bold">USA - MÉXICO - CANADÁ</p>
                 <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
                     <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">🏆 Asegurá tu lugar</div>
                     <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">📅 Salida Junio 2026</div>
                     <div className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">💰 Pagá en cuotas</div>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-4">Paquetes Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {trips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                ))}
            </div>
            
            {trips.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">Próximamente más paquetes para el Mundial 2026.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default WorldCup;
