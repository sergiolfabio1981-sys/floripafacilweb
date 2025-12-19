
import React, { useState, useEffect } from 'react';
import { getExcursions } from '../services/excursionService';
import { Excursion } from '../types';
import TripCard from '../components/TripCard';

const Excursions: React.FC = () => {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        const data = await getExcursions();
        setExcursions(data.map(e => ({...e, type: 'excursion' as const})));
    };
    fetchData();
  }, []);

  const filteredExcursions = excursions.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-cyan-800 py-12 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
             <div className="relative z-10 max-w-3xl mx-auto">
                 <h1 className="text-4xl font-bold mb-4">Excursiones y Paseos</h1>
                 <p className="text-lg text-cyan-100 mb-6">Completa tu viaje con experiencias inolvidables.</p>
                 <input 
                    type="text"
                    placeholder="Buscar excursión..."
                    className="w-full max-w-md px-4 py-2 rounded-full text-gray-800 outline-none shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExcursions.map(excursion => (
                    <TripCard key={excursion.id} trip={excursion} />
                ))}
            </div>
            
            {filteredExcursions.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No se encontraron excursiones.
                </div>
            )}
        </div>
    </div>
  );
};

export default Excursions;
