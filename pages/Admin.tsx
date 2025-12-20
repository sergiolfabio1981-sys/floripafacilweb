
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, Hotel, Apartment, HeroSlide, PromoBanner } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getHotels, saveHotel, deleteHotel, createEmptyHotel } from '../services/hotelService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, deleteDestination, createEmptyDestination } from '../services/destinationService';
import { getSellers, saveSeller, deleteSeller, createEmptySeller } from '../services/sellerService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner } from '../services/heroService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';
import { LOGO_URL, INITIAL_TRIPS, INITIAL_EXCURSIONS, INITIAL_CARS } from '../constants';

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
  const [isSaving, setIsSaving] = useState(false);

  // Data States
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'inventory' | 'guide' | 'destination' | 'seller' | 'hero' | 'banner' | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user, activeTab]);

  const loadData = async () => {
      setDbStatus('Cargando...');
      try {
          if (activeTab === 'inventory') {
              const [trips, cars, excursions, hotels, rentals] = await Promise.all([
                  getTrips().then(items => items.map(i => ({ ...i, type: 'trip' }))),
                  getCarRentals().then(items => items.map(i => ({ ...i, type: 'car' }))),
                  getExcursions().then(items => items.map(i => ({ ...i, type: 'excursion' }))),
                  getHotels().then(items => items.map(i => ({ ...i, type: 'hotel' }))),
                  getRentals().then(items => items.map(i => ({ ...i, type: 'rental' })))
              ]);
              setInventory([...trips, ...cars, ...excursions, ...hotels, ...rentals]);
              setDestinations(await getDestinations());
          } else if (activeTab === 'home') {
              setHeroSlides(await getHeroSlides());
              setPromoBanners(await getPromoBanners());
          } else if (activeTab === 'destinations') {
              setDestinations(await getDestinations());
          } else if (activeTab === 'guides') {
              setGuides(await getGuides());
          } else if (activeTab === 'sellers') {
              setSellers(await getSellers());
          } else if (activeTab === 'sales') {
              const { data } = await supabase.from('sales').select('*').order('date', { ascending: false });
              setSales(data || []);
          }
          setDbStatus('En Línea');
      } catch (e) {
          setDbStatus('Error de conexión');
          console.error(e);
      }
  };

  const handleSyncDefaults = async () => {
      if (!window.confirm("¿Deseas restaurar destinos (Camboriú, Bombinhas) y productos de ejemplo?")) return;
      setIsSaving(true);
      try {
          const defaultDests = [
              { id: 'dest-1', name: 'Florianópolis', active: true },
              { id: 'dest-2', name: 'Bombinhas', active: true },
              { id: 'dest-3', name: 'Camboriú', active: true }
          ];
          await supabase.from('destinations').upsert(defaultDests);
          
          // Scrub INITIAL_TRIPS to prevent schema mismatch errors
          const cleanTrips = INITIAL_TRIPS.map(({type, ...t}) => t);
          const cleanExcursions = INITIAL_EXCURSIONS.map(({type, ...e}) => e);
          const cleanCars = INITIAL_CARS.map(({type, ...c}) => c);

          await supabase.from('trips').upsert(cleanTrips);
          await supabase.from('excursions').upsert(cleanExcursions);
          await supabase.from('cars').upsert(cleanCars);

          alert("Base de datos sincronizada. Los destinos han vuelto.");
          loadData();
      } catch (err: any) {
          alert("Error al sincronizar: " + (err.message || 'Error desconocido'));
          console.error(err);
      } finally { setIsSaving(false); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser: any = { id: 'admin-1', name: 'Director Floripa Fácil', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('abras_user', JSON.stringify(adminUser));
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  // FUNCIÓN CRÍTICA: Limpiar campos antes de enviar a Supabase para evitar PGRST205
  const scrubItem = (item: any) => {
      const { type, calculatedPrice, calculatedProfit, ...cleaned } = item;
      return cleaned;
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          const cleanItem = scrubItem(editingItem);
          console.log("Intentando guardar:", cleanItem);
          
          if (modalType === 'inventory') {
              const type = editingItem.type; // Usamos el type del original
              if (type === 'trip') await saveTrip(cleanItem);
              else if (type === 'car') await saveCarRental(cleanItem);
              else if (type === 'excursion') await saveExcursion(cleanItem);
              else if (type === 'hotel') await saveHotel(cleanItem);
              else if (type === 'rental') await saveRental(cleanItem);
          } else if (modalType === 'hero') {
              await saveHeroSlide(cleanItem);
          } else if (modalType === 'banner') {
              await savePromoBanner(cleanItem);
          } else if (modalType === 'destination') {
              await saveDestination(cleanItem);
          } else if (modalType === 'guide') {
              await saveGuide(cleanItem);
          } else if (modalType === 'seller') {
              await saveSeller(cleanItem);
          }
          
          await loadData();
          setIsModalOpen(false);
          alert("¡Cambios guardados con éxito!");
      } catch (err: any) {
          console.error("Error detallado de Supabase:", err);
          let msg = "Error al guardar.";
          if (err.code === "PGRST205") msg = "Error PGRST205: La base de datos no tiene una de las columnas enviadas. Verifica que no hayas agregado campos especiales si no existen en Supabase.";
          alert(`${msg}\nDetalle: ${err.message || 'Consulta la consola'}`);
      } finally { setIsSaving(false); }
  };

  const openEdit = (type: any, item: any) => {
      setModalType(type);
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const getFilteredInventory = () => {
    switch(inventoryCategory) {
        case 'tours': return inventory.filter(i => i.type === 'trip');
        case 'transfers': return inventory.filter(i => i.type === 'excursion');
        case 'cars': return inventory.filter(i => i.type === 'car');
        case 'lodging': return inventory.filter(i => i.type === 'hotel' || i.type === 'rental');
        default: return inventory;
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md animate-pop-in">
                <div className="text-center mb-8">
                    <img src={LOGO_URL} className="h-32 mx-auto mb-4 rounded-full border-4 border-lime-500 bg-white p-2" alt="Logo" />
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Acceso Admin</h2>
                </div>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border-2 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border-2 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required />
                  <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest text-sm shadow-xl">Entrar al Sistema</button>
                </div>
            </form>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col h-screen md:sticky md:top-0">
          <div className="p-8 text-center border-b border-white/5">
              <img src={LOGO_URL} className="w-20 h-20 mx-auto rounded-full mb-4 border-2 border-green-500 bg-white p-1 shadow-lg" />
              <p className="text-[10px] font-black uppercase tracking-widest text-green-400">ESTADO: {dbStatus}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>🎒 Inventario</button>
              <button onClick={()=>setActiveTab('home')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='home' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>🏠 Gestión Home</button>
              <button onClick={()=>setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='destinations' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>📍 Destinos</button>
              <button onClick={()=>setActiveTab('guides')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='guides' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>🌍 Guías</button>
              <button onClick={()=>setActiveTab('sales')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sales' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>💰 Ventas</button>
              <button onClick={()=>setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sellers' ? 'bg-green-600 shadow-lg scale-105' : 'hover:bg-white/5 text-gray-400'}`}>👥 Vendedores</button>
              <div className="pt-4 mt-4 border-t border-white/5">
                <button onClick={handleSyncDefaults} className="w-full text-left px-6 py-4 text-[10px] font-black text-amber-400 hover:bg-amber-400/10 rounded-2xl uppercase tracking-widest">⚙️ Reparar Base de Datos</button>
                <button onClick={()=>{localStorage.removeItem('abras_user'); window.location.reload();}} className="w-full text-left px-6 py-4 text-[10px] font-black text-red-400 hover:bg-red-400/10 rounded-2xl uppercase tracking-widest mt-2">🚪 Cerrar Sesión</button>
              </div>
          </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Control de Inventario</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['tours', 'transfers', 'cars', 'lodging'].map(cat => (
                                <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={()=>openEdit('inventory', createEmptyTrip())} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all">+ Crear Nuevo</button>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="p-6">Producto</th>
                                  <th className="p-6 text-right">Precio</th>
                                  <th className="p-6 text-center">Estado</th>
                                  <th className="p-6 text-right">Acciones</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {getFilteredInventory().map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images?.[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-tight">{item.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-black text-green-700">
                                        {formatPrice((item.providerPrice || item.providerPricePerNight || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerNight || item.profitMarginPerDay || 0))}
                                    </td>
                                    <td className="p-6 text-center">
                                        {item.isOffer ? <span className="bg-lime-100 text-lime-700 text-[8px] font-black px-2 py-1 rounded-full shadow-sm">OFERTA</span> : <span className="text-[8px] font-black text-slate-300">ESTÁNDAR</span>}
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button onClick={()=>openEdit('inventory', item)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-all shadow-sm">✏️</button>
                                        <button onClick={async ()=>{if(window.confirm('¿Eliminar definitivamente?')) {await deleteTrip(item.id); loadData();}}} className="p-2 bg-slate-100 text-slate-300 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all">🗑️</button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'home' && (
              <div className="space-y-12 animate-fade-in">
                  <div>
                      <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-6">Slider Principal (Home)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {heroSlides.map(slide => (
                              <div key={slide.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                                  <div className="h-32 bg-slate-200 relative">
                                      <img src={slide.image} className="w-full h-full object-cover" />
                                      <button onClick={()=>openEdit('hero', slide)} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black uppercase text-[10px] tracking-widest">Editar Slider</button>
                                  </div>
                                  <div className="p-6">
                                      <p className="font-black text-slate-800 text-sm uppercase">{slide.title}</p>
                                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{slide.subtitle}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div>
                      <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-6">Banners Promocionales</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {promoBanners.map(banner => (
                              <div key={banner.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group">
                                  <img src={banner.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                                  <div className="flex-1">
                                      <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{banner.badge}</span>
                                      <p className="font-black text-slate-800 text-lg mt-1 uppercase tracking-tighter">{banner.title}</p>
                                      <button onClick={()=>openEdit('banner', banner)} className="text-xs font-black text-green-600 hover:underline mt-2 flex items-center gap-1 uppercase tracking-widest">✏️ Editar Banner</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'destinations' && (
              <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Destinos Operativos</h2>
                    <button onClick={()=>openEdit('destination', createEmptyDestination())} className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest">+ Agregar Destino</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {destinations.map(dest => (
                          <div key={dest.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex justify-between items-center hover:border-green-200 transition-all">
                              <span className="font-black text-slate-700 uppercase text-xs tracking-widest">{dest.name}</span>
                              <div className="flex gap-2">
                                  <button onClick={()=>openEdit('destination', dest)} className="text-slate-300 hover:text-green-500 transition-colors">✏️</button>
                                  <button onClick={async ()=>{if(window.confirm('¿Eliminar?')) {await deleteDestination(dest.id); loadData();}}} className="text-slate-200 hover:text-red-500 transition-colors">🗑️</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </main>

      {/* MODAL UNIVERSAL DE EDICIÓN - REFORZADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                        Editando {modalType}: {editingItem.title || editingItem.name}
                    </h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">×</button>
                </div>
                
                <form onSubmit={handleSave} className="p-10 overflow-y-auto space-y-8">
                    {modalType === 'inventory' && (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                                <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500 transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino</label>
                                <select value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500">
                                    <option value="">Seleccionar...</option>
                                    {destinations.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio Costo (USD)</label>
                                <input type="number" value={editingItem.providerPrice || editingItem.providerPricePerNight || editingItem.providerPricePerDay || 0} onChange={e=>{
                                    const val = Number(e.target.value);
                                    if(editingItem.type==='hotel'||editingItem.type==='rental') setEditingItem({...editingItem, providerPricePerNight: val});
                                    else if(editingItem.type==='car') setEditingItem({...editingItem, providerPricePerDay: val});
                                    else setEditingItem({...editingItem, providerPrice: val});
                                }} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margen (USD)</label>
                                <input type="number" value={editingItem.profitMargin || editingItem.profitMarginPerNight || editingItem.profitMarginPerDay || 0} onChange={e=>{
                                    const val = Number(e.target.value);
                                    if(editingItem.type==='hotel'||editingItem.type==='rental') setEditingItem({...editingItem, profitMarginPerNight: val});
                                    else if(editingItem.type==='car') setEditingItem({...editingItem, profitMarginPerDay: val});
                                    else setEditingItem({...editingItem, profitMargin: val});
                                }} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                            </div>
                        </div>

                        {/* SECCIÓN BOOKING STYLE - CON ADVERTENCIA */}
                        <div className="space-y-6 pt-6 border-t bg-slate-50/50 p-6 rounded-3xl">
                            <div className="flex justify-between items-center">
                                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Detalles Pro (Estilo Booking)</h4>
                                <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">⚠️ Requiere columnas en Supabase</span>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lo más destacado (Una frase por línea)</label>
                                <textarea 
                                    value={editingItem.highlights?.join('\n') || ''} 
                                    onChange={e=>setEditingItem({...editingItem, highlights: e.target.value.split('\n').filter(l=>l!=='')})} 
                                    className="w-full bg-white p-4 rounded-2xl font-medium border-2 focus:border-green-500 h-24 text-sm"
                                    placeholder="Ej: Vista panorámica\nTraslado VIP"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-green-600 uppercase tracking-widest">Incluye (Uno por línea)</label>
                                    <textarea 
                                        value={editingItem.included?.join('\n') || ''} 
                                        onChange={e=>setEditingItem({...editingItem, included: e.target.value.split('\n').filter(l=>l!=='')})} 
                                        className="w-full bg-white p-4 rounded-2xl font-medium border-2 focus:border-green-500 h-24 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-red-400 uppercase tracking-widest">No Incluye (Uno por línea)</label>
                                    <textarea 
                                        value={editingItem.notIncluded?.join('\n') || ''} 
                                        onChange={e=>setEditingItem({...editingItem, notIncluded: e.target.value.split('\n').filter(l=>l!=='')})} 
                                        className="w-full bg-white p-4 rounded-2xl font-medium border-2 focus:border-green-500 h-24 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción Extensa</label>
                                <textarea 
                                    value={editingItem.description} 
                                    onChange={e=>setEditingItem({...editingItem, description: e.target.value})} 
                                    className="w-full bg-white p-4 rounded-2xl font-medium border-2 focus:border-green-500 h-32 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Imágenes (Una por línea)</label>
                                <textarea 
                                    value={editingItem.images?.join('\n') || ''} 
                                    onChange={e=>setEditingItem({...editingItem, images: e.target.value.split('\n').filter(l=>l!=='')})} 
                                    className="w-full bg-slate-50 p-4 rounded-2xl font-medium border-2 focus:border-green-500 h-24 text-sm"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-6">
                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-slate-100">
                                    <input type="checkbox" checked={editingItem.isOffer} onChange={e=>setEditingItem({...editingItem, isOffer: e.target.checked})} className="w-6 h-6 accent-green-600 cursor-pointer" />
                                    <label className="text-xs font-black uppercase text-slate-600">Marcar como OFERTA DESTACADA</label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Etiqueta (Ej: "Agotándose")</label>
                                    <input value={editingItem.specialLabel || ''} onChange={e=>setEditingItem({...editingItem, specialLabel: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 focus:border-green-500" />
                                </div>
                            </div>
                        </div>
                        </>
                    )}

                    {modalType === 'hero' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Título" />
                                <input value={editingItem.ctaText} onChange={e=>setEditingItem({...editingItem, ctaText: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Texto Botón" />
                            </div>
                            <textarea value={editingItem.subtitle} onChange={e=>setEditingItem({...editingItem, subtitle: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Bajada de texto" rows={3} />
                            <input value={editingItem.image} onChange={e=>setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="URL Imagen (Unsplash, etc)" />
                        </div>
                    )}

                    {modalType === 'banner' && (
                        <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Título Banner" />
                                <input value={editingItem.badge} onChange={e=>setEditingItem({...editingItem, badge: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Etiqueta (Ej: ÚLTIMO MOMENTO)" />
                             </div>
                             <input value={editingItem.image} onChange={e=>setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="URL Imagen" />
                             <input value={editingItem.link} onChange={e=>setEditingItem({...editingItem, link: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Link de redirección" />
                        </div>
                    )}

                    {modalType === 'destination' && (
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Ciudad / Zona</label>
                            <input value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 focus:border-green-500" required />
                         </div>
                    )}

                    <div className="pt-8 border-t flex justify-end gap-4 shrink-0">
                        <button type="button" onClick={()=>setIsModalOpen(false)} className="px-8 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-3">
                            {isSaving ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div> Guardando...</>
                            ) : 'Confirmar y Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
