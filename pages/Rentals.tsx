
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Apartment } from '../types';
import { getRentals } from '../services/rentalService';
import TripCard from '../components/TripCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

if ((L.Icon.Default.prototype as any)._getIconUrl) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState<Apartment[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Apartment[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minBedrooms, setMinBedrooms] = useState<number>(1);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const { t } = useLanguage();
  const { formatPrice, convertPrice, currency } = useCurrency();
  const [allAmenities, setAllAmenities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getRentals();
        const mappedData = data.map(r => ({...r, type: 'rental' as const}));
        setRentals(mappedData);
        
        const amenitiesSet = new Set<string>();
        mappedData.forEach(r => r.amenities.forEach(a => amenitiesSet.add(a)));
        setAllAmenities(Array.from(amenitiesSet).sort());
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...rentals];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(term) || r.location.toLowerCase().includes(term));
    }
    if (minPrice !== '') result = result.filter(r => convertPrice(r.pricePerNight) >= Number(minPrice));
    if (maxPrice !== '') result = result.filter(r => convertPrice(r.pricePerNight) <= Number(maxPrice));
    result = result.filter(r => r.bedrooms >= minBedrooms);
    result = result.filter(r => r.maxGuests >= minGuests);
    if (selectedAmenities.length > 0) {
      result = result.filter(r => selectedAmenities.every(amenity => r.amenities.includes(amenity)));
    }
    if (sortOrder === 'asc') result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortOrder === 'desc') result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else result.sort((a, b) => (a.isOffer === b.isOffer ? 0 : a.isOffer ? -1 : 1));
    setFilteredRentals(result);
  }, [rentals, searchTerm, minPrice, maxPrice, minBedrooms, minGuests, selectedAmenities, sortOrder, currency]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-cyan-900 text-white py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512918760532-3edbed71741b?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Encuentra tu Alojamiento Ideal</h1>
            <p className="text-cyan-100">Departamentos, casas y penthouses en los mejores destinos.</p>
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <button className="lg:hidden w-full bg-white p-3 rounded-lg shadow text-gray-700 font-bold flex justify-between items-center" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <span>{t('filters.title')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>
        <aside className={`lg:w-1/4 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">{t('filters.search')}</h3>
                <input type="text" placeholder="Ciudad o nombre..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-cyan-500 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">{t('filters.price')} ({currency})</h3>
                <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Mín" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')} />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Máx" className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">{t('filters.capacity')}</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase">{t('filters.bedrooms')} (Mín)</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm bg-white" value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))}>{[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}+</option>)}</select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase">{t('filters.guests')} (Mín)</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm bg-white" value={minGuests} onChange={(e) => setMinGuests(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 8, 10].map(num => <option key={num} value={num}>{num}+</option>)}</select>
                    </div>
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Comodidades</h3>
                <div className="space-y-2">
                    {allAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-cyan-600 focus:ring-cyan-500" checked={selectedAmenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} /><span className="text-sm text-gray-600">{amenity}</span></label>
                    ))}
                </div>
            </div>
        </aside>
        <div className="lg:w-3/4 flex flex-col">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 font-medium">{filteredRentals.length} resultados encontrados</p>
                <div className="flex items-center gap-4">
                    <select className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-cyan-500 outline-none" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}><option value="default">{t('filters.featured')}</option><option value="asc">{t('filters.priceLow')}</option><option value="desc">{t('filters.priceHigh')}</option></select>
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} title="Vista Lista"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
                        <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} title="Vista Mapa"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
                    </div>
                </div>
            </div>
            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRentals.map(rental => (<TripCard key={rental.id} trip={rental} />))}
                    {filteredRentals.length === 0 && (<div className="col-span-full text-center py-10"><p className="text-gray-500 text-lg">No se encontraron propiedades con esos filtros.</p><button onClick={() => { setSearchTerm(''); setMinPrice(''); setMaxPrice(''); setMinBedrooms(1); setMinGuests(1); setSelectedAmenities([]); }} className="mt-4 text-cyan-600 underline">Limpiar Filtros</button></div>)}
                </div>
            ) : (
                <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
                    <MapContainer center={[-27.5954, -48.5480]} zoom={5} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filteredRentals.map(rental => rental.lat && rental.lng && (<Marker key={rental.id} position={[rental.lat, rental.lng]}><Popup><div className="w-48"><img src={rental.images[0]} alt={rental.title} className="w-full h-24 object-cover rounded mb-2" /><h3 className="font-bold text-sm mb-1">{rental.title}</h3><p className="text-cyan-600 font-bold">{formatPrice(rental.pricePerNight)}</p><Link to={`/rentals/${rental.id}`} className="text-xs underline text-blue-500 block mt-1">Ver propiedad</Link></div></Popup></Marker>))}
                    </MapContainer>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Rentals;
