
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, Hotel, Apartment } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getHotels, saveHotel, deleteHotel, createEmptyHotel } from '../services/hotelService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, deleteDestination, createEmptyDestination } from '../services/destinationService';
import { getSellers, saveSeller, deleteSeller, createEmptySeller } from '../services/sellerService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';
import { LOGO_URL, LOGO_FALLBACK_URL } from '../constants';

const Admin: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [user, setUser] = useState<Seller | null>(() => {
      const saved = localStorage.getItem('abras_user');
      return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const [inventoryCategory, setInventoryCategory] = useState<'tours' | 'transfers' | 'cars' | 'lodging'>('tours');
  const [dbStatus, setDbStatus] = useState<string>('checking...');
  const [dbError, setDbError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  
  const [destFilter, setDestFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'inventory_item' | 'guide' | 'destination' | 'seller' | null>(null);

  useEffect(() => {
    checkConnection();
    if (user) loadData();
  }, [user, activeTab]);

  const checkConnection = async () => {
      try {
          const { data, error } = await supabase.from('destinations').select('id').limit(1);
          if (error) {
              setDbStatus(`Error: ${error.code}`);
              setDbError(error.message);
              return;
          }
          setDbStatus('Conectado');
          setDbError(null);
      } catch (e: any) {
          setDbStatus('Fallo de red');
          setDbError(e.message || 'Error desconocido');
      }
  };

  const loadData = async () => {
      try {
          if (activeTab === 'inventory' || modalType === 'inventory_item') {
              const [trips, cars, excursions, hotels, rentals] = await Promise.all([
                  getTrips().then(items => items.map(i => ({ ...i, type: 'trip' }))),
                  getCarRentals().then(items => items.map(i => ({ ...i, type: 'car' }))),
                  getExcursions().then(items => items.map(i => ({ ...i, type: 'excursion' }))),
                  getHotels().then(items => items.map(i => ({ ...i, type: 'hotel' }))),
                  getRentals().then(items => items.map(i => ({ ...i, type: 'rental' })))
              ]);
              setInventory([...trips, ...cars, ...excursions, ...hotels, ...rentals]);
              const dests = await getDestinations();
              setDestinations(dests);
          }
          if (activeTab === 'destinations') {
              const dests = await getDestinations();
              setDestinations(dests);
          }
          if (activeTab === 'guides') {
              const data = await getGuides();
              setGuides(data);
          }
          if (activeTab === 'sellers') {
              const data = await getSellers();
              setSellers(data);
          }
          if (activeTab === 'metrics' || activeTab === 'sales') {
              const { data } = await supabase.from('sales').select('*').order('date', { ascending: false });
              setSales(data || []);
          }
      } catch (e) {
          console.error("Error al cargar datos:", e);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser: any = { id: 'admin-1', name: 'Director Floripa Fácil', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('abras_user', JSON.stringify(adminUser));
      return;
    }
    alert("Acceso denegado.");
  };
  
  const handleLogout = () => { setUser(null); localStorage.removeItem('abras_user'); };

  const getFilteredInventory = () => {
    let list = inventory;
    if (destFilter !== 'all') list = list.filter(i => i.location && i.location.includes(destFilter));
    switch(inventoryCategory) {
        case 'tours': return list.filter(i => i.type === 'trip' || (i.type === 'excursion' && !i.title.toLowerCase().includes('transfer')));
        case 'transfers': return list.filter(i => i.type === 'excursion' && (i.title.toLowerCase().includes('transfer') || i.title.toLowerCase().includes('traslado')));
        case 'cars': return list.filter(i => i.type === 'car');
        case 'lodging': return list.filter(i => i.type === 'hotel' || i.type === 'rental');
        default: return list;
    }
  };

  if (!user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-6 animate-pop-in">
                <div className="text-center">
                    <div className="w-36 h-36 mx-auto mb-6 bg-slate-50 rounded-full flex items-center justify-center p-4 border-4 border-lime-500 shadow-xl overflow-hidden">
                        <img 
                          src={LOGO_URL} 
                          className="w-full h-full object-contain" 
                          alt="Logo" 
                          onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                        />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Acceso Central</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Floripa Fácil - Administración</p>
                </div>
                <div className="space-y-3">
                  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-medium" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-medium" required />
                </div>
                <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest text-sm shadow-xl">Entrar al Sistema</button>
            </form>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 flex flex-col">
          <div className="p-8 border-b border-white/10 text-center">
              <div className="w-24 h-24 mx-auto rounded-full mb-4 border-2 border-green-500 shadow-xl bg-white p-2 overflow-hidden flex items-center justify-center">
                  <img 
                    src={LOGO_URL} 
                    className="w-full h-full object-contain" 
                    alt="Logo" 
                    onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                  />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-green-400">Admin Floripa Fácil</h3>
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dbStatus.includes('Conectado') ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{dbStatus}</span>
                  </div>
              </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>🎒 Inventario</button>
              <button onClick={()=>setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sellers' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>👥 Vendedores</button>
              <button onClick={()=>setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='destinations' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>📍 Destinos</button>
              <button onClick={()=>setActiveTab('sales')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sales' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>💰 Ventas</button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 mt-10 transition-all italic">Cerrar Sesión</button>
          </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="w-full">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Anuncios en Sistema</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['tours', 'transfers', 'cars', 'lodging'].map(cat => (
                                <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${inventoryCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <tbody className="divide-y divide-slate-50">
                              {getFilteredInventory().map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images?.[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div><p className="font-black text-slate-800">{item.title}</p><span className="text-[9px] font-bold text-green-600 uppercase">{item.type}</span></div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right font-black">{formatPrice((item.providerPrice || item.providerPricePerNight || 0) + (item.profitMargin || 0))}</td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
      </main>
    </div>
  );
};

export default Admin;
