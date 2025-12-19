
import React, { useState, useEffect } from 'react';
import { getGroupTrips } from '../services/groupService';
import { GroupTrip } from '../types';
import TripCard from '../components/TripCard';

const Groups: React.FC = () => {
  const [trips, setTrips] = useState<GroupTrip[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        const data = await getGroupTrips();
        setTrips(data.map(t => ({...t, type: 'group' as const})));
    };
    fetchData();
  }, []);

  const filteredTrips = trips.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-purple-900 py-12 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520645521318-f03a712f0ac5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
             <div className="relative z-10 max-w-3xl mx-auto">
                 <h1 className="text-4xl font-bold mb-4">Salidas Grupales</h1>
                 <p className="text-lg text-purple-100 mb-6">Viaja acompañado, conoce gente nueva y vive experiencias compartidas.</p>
                 <div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-lg mx-auto">
                    <svg className="h-5 w-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        placeholder="Buscar destino grupal..."
                        className="w-full px-4 py-2 rounded-full text-gray-800 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                ))}
            </div>
            
            {filteredTrips.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-500">No encontramos salidas grupales activas por el momento.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Groups;
