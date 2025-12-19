
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHotels } from '../services/hotelService';
import { getRentals } from '../services/rentalService';
import { ListingItem } from '../types';
import TripCard from '../components/TripCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Icons
if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

const Accommodations: React.FC = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ListingItem[]>([]);
  const [activeType, setActiveType] = useState<'all' | 'hotel' | 'rental'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minGuests, setMinGuests] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  
  const { t } = useLanguage();
  const { formatPrice, convertPrice, currency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsData, rentalsData] = await Promise.all([
          getHotels(),
          getRentals()
        ]);
        const hotels = hotelsData.map(h => ({...h, type: 'hotel' as const}));
        const rentals = rentalsData.map(r => ({...r, type: 'rental' as const}));
        setItems([...hotels, ...rentals]);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...items];

    // 1. Filter by Type
    if (activeType !== 'all') {
        result = result.filter(item => item.type === activeType);
    }

    // 2. Search
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.location.toLowerCase().includes(term)
        );
    }

    // 3. Price
    if (minPrice !== '') {
        result = result.filter(item => {
            const price = (item as any).pricePerNight || 0;
            return convertPrice(price) >= Number(minPrice);
        });
    }
    if (maxPrice !== '') {
        result = result.filter(item => {
            const price = (item as any).pricePerNight || 0;
            return convertPrice(price) <= Number(maxPrice);
        });
    }

    // 4. Capacity (Guests) - Only applies to Rentals usually, but useful general filter
    if (minGuests > 1) {
        result = result.filter(item => {
            if (item.type === 'rental') return (item as any).maxGuests >= minGuests;
            // Hotels usually fit 2-4, let's assume they fit if filter is low
            return minGuests <= 4; 
        });
    }

    // 5. Sorting
    if (sortOrder === 'asc') {
        result.sort((a, b) => ((a as any).pricePerNight || 0) - ((b as any).pricePerNight || 0));
    } else if (sortOrder === 'desc') {
        result.sort((a, b) => ((b as any).pricePerNight || 0) - ((a as any).pricePerNight || 0));
    } else {
        // Default: Offers first
        result.sort((a, b) => (a.isOffer === b.isOffer ? 0 : a.isOffer ? -1 : 1));
    }

    setFilteredItems(result);
  }, [items, activeType, searchTerm, minPrice, maxPrice, minGuests, sortOrder, currency]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 py-12 px-4 text-center text-white relative overflow-hidden flex-shrink-0">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <h1 className="text-4xl font-bold mb-4">Alojamientos Exclusivos</h1>
                 <p className="text-lg text-cyan-100 mb-6">Hoteles de lujo y Departamentos temporarios.</p>
                 
                 <div className="flex justify-center gap-4 mb-6">
                     <button onClick={() => setActiveType('all')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeType === 'all' ? 'bg-white text-cyan-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>Todos</button>
                     <button onClick={() => setActiveType('hotel')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeType === 'hotel' ? 'bg-white text-cyan-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>Hoteles</button>
                     <button onClick={() => setActiveType('rental')} className={`px-6 py-2 rounded-full font-bold transition-all ${activeType === 'rental' ? 'bg-white text-cyan-900' : 'bg-white/20 text-white hover:bg-white/30'}`}>Alquileres</button>
                 </div>
             </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative">
            {/* MOBILE FILTER TOGGLE */}
            <button className="lg:hidden w-full bg-white p-3 rounded-lg shadow text-gray-700 font-bold flex justify-between items-center mb-4" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <span>Filtros</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>

            {/* SIDEBAR FILTERS - LEFT SIDE */}
            <aside className={`lg:w-1/4 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24 h-fit`}>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3">Buscar</h3>
                    <input type="text" placeholder="Destino o nombre..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-cyan-500 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3">Precio ({currency})</h3>
                    <div className="flex gap-2 items-center">
                        <input type="number" placeholder="Mín" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')} />
                        <span className="text-gray-400">-</span>
                        <input type="number" placeholder="Máx" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3">Capacidad</h3>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase">Huéspedes (Mín)</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm bg-white" value={minGuests} onChange={(e) => setMinGuests(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 8, 10].map(num => <option key={num} value={num}>{num}+</option>)}</select>
                    </div>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <div className="lg:w-3/4 flex flex-col">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 font-medium">{filteredItems.length} resultados</p>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-cyan-500 outline-none flex-grow sm:flex-grow-0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
                            <option value="default">Recomendados</option>
                            <option value="asc">Menor Precio</option>
                            <option value="desc">Mayor Precio</option>
                        </select>
                        <div className="bg-gray-100 p-1 rounded-lg flex shrink-0">
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} title="Vista Lista"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
                            <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} title="Vista Mapa"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
                        </div>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredItems.map(item => (
                            <TripCard key={`${item.type}-${item.id}`} trip={item} />
                        ))}
                        {filteredItems.length === 0 && (
                            <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-lg">No se encontraron alojamientos con estos filtros.</p>
                                <button onClick={() => { setSearchTerm(''); setActiveType('all'); setMinPrice(''); setMaxPrice(''); }} className="mt-4 text-cyan-600 underline">Ver todos</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
                        <MapContainer center={[-27.5954, -48.5480]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {filteredItems.map(item => {
                                const lat = (item as any).lat;
                                const lng = (item as any).lng;
                                if (lat && lng) {
                                    return (
                                        <Marker key={item.id} position={[lat, lng]}>
                                            <Popup>
                                                <div className="w-48">
                                                    <img src={item.images[0]} alt={item.title} className="w-full h-24 object-cover rounded mb-2" />
                                                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                                                    <p className="text-cyan-600 font-bold">{formatPrice((item as any).pricePerNight)}</p>
                                                    <Link to={item.type === 'hotel' ? `/hotels/${item.id}` : `/rentals/${item.id}`} className="text-xs underline text-blue-500 block mt-1">Ver Detalle</Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                }
                                return null;
                            })}
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Accommodations;
