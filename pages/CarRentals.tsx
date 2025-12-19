
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
        <div className="bg-lime-600 py-12 px-4 text-center text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">ALQUILER DE COCHES</h1>
                 <p className="text-lg text-lime-50 mb-8">Recorre Florianópolis y el sur de Brasil a tu propio ritmo.</p>
                 
                 <div className="flex flex-wrap justify-center gap-2 mb-8">
                     {['Todos', 'Económico', 'SUV', 'Luxury', 'Pick-up'].map(cat => (
                         <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? 'bg-white text-green-700 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>{cat}</button>
                     ))}
                 </div>

                 <div className="bg-white p-2 rounded-full shadow-xl flex items-center max-w-lg mx-auto">
                    <input 
                        type="text"
                        placeholder="Buscar marca o modelo (ej: Chevrolet, Onix...)"
                        className="w-full px-6 py-2 rounded-full text-gray-800 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
             </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCars.map(car => (
                    <TripCard key={car.id} trip={car} />
                ))}
            </div>
            
            {filteredCars.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-xl font-bold">No encontramos vehículos en esta categoría por ahora.</p>
                    <button onClick={()=>{setSearchTerm(''); setActiveCategory('Todos')}} className="mt-4 text-green-600 underline">Ver todos los vehículos</button>
                </div>
            )}
        </div>

        <div className="bg-green-50 py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-green-900 mb-8">¿Qué incluye nuestro servicio?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="text-3xl mb-3">🛡️</div>
                        <h3 className="font-bold mb-2">Seguro Total</h3>
                        <p className="text-xs text-gray-500">Tranquilidad absoluta ante cualquier imprevisto en la ruta.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="text-3xl mb-3">⛽</div>
                        <h3 className="font-bold mb-2">Tanque Lleno</h3>
                        <p className="text-xs text-gray-500">Recibe el vehículo listo para salir a explorar las playas.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="text-3xl mb-3">📞</div>
                        <h3 className="font-bold mb-2">Asistencia 24hs</h3>
                        <p className="text-xs text-gray-500">Soporte técnico y auxilio mecánico en todo el litoral.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CarRentals;
