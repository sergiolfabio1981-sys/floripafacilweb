
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
import { LOGO_URL, LOGO_FALLBACK_URL, INITIAL_TRIPS, INITIAL_EXCURSIONS, INITIAL_CARS } from '../constants';

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
          setDbStatus('Conectado');
      } catch (e) {
          setDbStatus('Error de conexión');
          console.error(e);
      }
  };

  const handleSyncDefaults = async () => {
      if (!window.confirm("¿Deseas restaurar los destinos y productos de ejemplo? (Camboriú, Bombinhas, etc.)")) return;
      setIsSaving(true);
      try {
          // Re-seed Destinos
          const defaultDests = [
              { id: 'dest-1', name: 'Florianópolis', active: true },
              { id: 'dest-2', name: 'Bombinhas', active: true },
              { id: 'dest-3', name: 'Camboriú', active: true }
          ];
          await supabase.from('destinations').upsert(defaultDests);
          
          // Re-seed algunos productos si están vacíos
          await supabase.from('trips').upsert(INITIAL_TRIPS);
          await supabase.from('excursions').upsert(INITIAL_EXCURSIONS);
          await supabase.from('cars').upsert(INITIAL_CARS);

          alert("Sincronización completada. Los destinos y ejemplos han sido restaurados.");
          loadData();
      } catch (err) {
          alert("Error al sincronizar: " + (err as any).message);
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

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          // SCRUBBING: Limpiar objeto para evitar error PGRST205 (columnas inexistentes)
          const cleanItem = { ...editingItem };
          
          if (modalType === 'inventory') {
              const type = cleanItem.type;
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
          alert("Guardado correctamente.");
      } catch (err: any) {
          console.error(err);
          alert(`Error al guardar (PGRST): Asegúrate que todos los campos sean correctos. Detalle: ${err.message}`);
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
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
          <div className="p-8 text-center border-b border-white/5">
              <img src={LOGO_URL} className="w-20 h-20 mx-auto rounded-full mb-4 border-2 border-green-500 bg-white p-1" />
              <p className="text-[10px] font-black uppercase tracking-widest text-green-400">{dbStatus}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🎒 Inventario</button>
              <button onClick={()=>setActiveTab('home')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='home' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🏠 Gestión Home</button>
              <button onClick={()=>setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='destinations' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>📍 Destinos</button>
              <button onClick={()=>setActiveTab('guides')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='guides' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🌍 Guías</button>
              <button onClick={()=>setActiveTab('sales')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sales' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>💰 Ventas</button>
              <button onClick={()=>setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sellers' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>👥 Vendedores</button>
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
                                        {item.isOffer ? <span className="bg-lime-100 text-lime-700 text-[8px] font-black px-2 py-1 rounded-full">OFERTA</span> : <span className="text-[8px] font-black text-slate-300">ESTÁNDAR</span>}
                                    </td>
                                    <td className="p-6 text-right space-x-2">
                                        <button onClick={()=>openEdit('inventory', item)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button onClick={async ()=>{if(window.confirm('¿Eliminar?')) {await deleteTrip(item.id); loadData();}}} className="p-2 bg-slate-100 text-slate-300 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
                      <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic mb-6">Slider Principal (Hero)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {heroSlides.map(slide => (
                              <div key={slide.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                                  <div className="h-32 bg-slate-200 relative">
                                      <img src={slide.image} className="w-full h-full object-cover" />
                                      <button onClick={()=>openEdit('hero', slide)} className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">✏️</button>
                                  </div>
                                  <div className="p-6">
                                      <p className="font-black text-slate-800 text-sm">{slide.title}</p>
                                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{slide.subtitle}</p>
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
                                  <img src={banner.image} className="w-24 h-24 rounded-2xl object-cover" />
                                  <div className="flex-1">
                                      <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">{banner.badge}</span>
                                      <p className="font-black text-slate-800 text-lg mt-1">{banner.title}</p>
                                      <button onClick={()=>openEdit('banner', banner)} className="text-xs font-black text-slate-400 hover:text-green-600 mt-2 flex items-center gap-1 uppercase tracking-widest">✏️ Editar Banner</button>
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
                    <h2 className="text-3xl font-black text-slate-800 uppercase italic">Destinos Activos</h2>
                    <button onClick={()=>openEdit('destination', createEmptyDestination())} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold">+ Agregar Destino</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {destinations.map(dest => (
                          <div key={dest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                              <span className="font-black text-slate-700">{dest.name}</span>
                              <button onClick={()=>openEdit('destination', dest)} className="text-slate-300 hover:text-green-500 transition-colors">✏️</button>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </main>

      {/* MODAL UNIVERSAL DE EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Editando {modalType}</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">×</button>
                </div>
                
                <form onSubmit={handleSave} className="p-10 overflow-y-auto space-y-6">
                    {modalType === 'inventory' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Producto</label>
                                <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</label>
                                <select value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2">
                                    <option value="">Seleccionar Destino...</option>
                                    {destinations.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Costo Proveedor (USD)</label>
                                <input type="number" value={editingItem.providerPrice || editingItem.providerPricePerNight || 0} onChange={e=>setEditingItem({...editingItem, providerPrice: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margen Ganancia (USD)</label>
                                <input type="number" value={editingItem.profitMargin || editingItem.profitMarginPerNight || 0} onChange={e=>setEditingItem({...editingItem, profitMargin: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2" required />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Imagen Principal</label>
                                <input value={editingItem.images?.[0]} onChange={e=>setEditingItem({...editingItem, images: [e.target.value]})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2" />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-3">
                                <input type="checkbox" checked={editingItem.isOffer} onChange={e=>setEditingItem({...editingItem, isOffer: e.target.checked})} className="w-5 h-5 accent-green-500" />
                                <label className="text-xs font-black uppercase text-slate-600">Marcar como Oferta Destacada</label>
                            </div>
                        </div>
                    )}

                    {modalType === 'hero' && (
                        <div className="space-y-6">
                            <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Título Hero" />
                            <textarea value={editingItem.subtitle} onChange={e=>setEditingItem({...editingItem, subtitle: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="Subtítulo" rows={2} />
                            <input value={editingItem.image} onChange={e=>setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" placeholder="URL Imagen" />
                        </div>
                    )}

                    {modalType === 'destination' && (
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Destino (Ciudad/Estado)</label>
                            <input value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2" required />
                         </div>
                    )}

                    <div className="pt-8 border-t flex justify-end gap-4">
                        <button type="button" onClick={()=>setIsModalOpen(false)} className="px-8 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-green-700 transition-all disabled:opacity-50">
                            {isSaving ? 'Guardando...' : 'Confirmar Cambios'}
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
