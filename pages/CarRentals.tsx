
import React, { useState, useEffect } from 'react';
import { getCarRentals } from '../services/carRentalService';
import { CarRental } from '../types';
import TripCard from '../components/TripCard';

const CarRentals: React.FC = () => {
  const [cars, setCars] = useState<CarRental[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
        const data = await getCarRentals();
        setCars(data.map(c => ({...c, type: 'car' as const})));
    };
    fetchData();
  }, []);

  const filteredCars = cars.filter(c => {
    const matchesSearch = c.brand.toLowerCase().includes(searchTerm.toLowerCase()) || c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
        <div className="bg-lime-600 py-16 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic">Rent a Car FF</h1>
                 <p className="text-lg text-lime-50 mb-10 font-medium">Flota Movida garantizada. Recorre Florianópolis con vehículos nuevos y seguros.</p>
                 
                 <div className="flex flex-wrap justify-center gap-2 mb-10">
                     {['Todos', 'Económico', 'Compacto', 'Sedán', 'SUV', 'Luxury'].map(cat => (
                         <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)} 
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-green-700 shadow-xl scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                         >
                            {cat}
                         </button>
                     ))}
                 </div>

                 <div className="bg-white p-3 rounded-[2rem] shadow-2xl flex items-center max-w-lg mx-auto border-4 border-lime-400">
                    <input 
                        type="text"
                        placeholder="Buscar por marca o modelo..."
                        className="w-full px-6 py-3 rounded-full text-gray-800 outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="bg-lime-500 p-3 rounded-full text-green-900 ml-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredCars.map(car => (
                    <TripCard key={car.id} trip={car} />
                ))}
            </div>
            
            {filteredCars.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                    <div className="text-6xl mb-6">🚗</div>
                    <p className="text-gray-400 text-xl font-black uppercase tracking-widest">No hay vehículos disponibles en esta categoría.</p>
                    <button onClick={()=>{setSearchTerm(''); setActiveCategory('Todos')}} className="mt-6 text-green-600 font-bold underline">Ver toda la flota</button>
                </div>
            )}
        </div>

        {/* INFO SECTION */}
        <div className="bg-slate-900 py-24 px-4 border-t-8 border-lime-500">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-lime-500/10 rounded-[2rem] flex items-center justify-center text-4xl mb-6 border border-lime-500/30">🛡️</div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest mb-3">Seguro Protegido</h3>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">Cobertura total contra colisión, robo e incendio. Viaja con respaldo Movida Frotas.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-lime-500/10 rounded-[2rem] flex items-center justify-center text-4xl mb-6 border border-lime-500/30">⛽</div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest mb-3">Kilometraje Libre</h3>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">Sin límites diarios. Recorre desde el sur de la isla hasta Bombinhas sin preocupaciones.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-lime-500/10 rounded-[2rem] flex items-center justify-center text-4xl mb-6 border border-lime-500/30">⚡</div>
                        <h3 className="text-white font-black uppercase text-sm tracking-widest mb-3">Check-in Express</h3>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">Retiro rápido en Aeropuerto o entrega exclusiva en tu lugar de alojamiento.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CarRentals;
