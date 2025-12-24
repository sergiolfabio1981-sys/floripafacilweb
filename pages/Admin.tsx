
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, AppMessage, HeroSlide, PromoBanner } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, deleteDestination, createEmptyDestination } from '../services/destinationService';
import { getSellers, saveSeller, deleteSeller, createEmptySeller } from '../services/sellerService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner } from '../services/heroService';
import { getMessages, markAsRead, deleteMessage, sendMessage } from '../services/messageService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';
import { LOGO_URL, INITIAL_TRIPS, INITIAL_EXCURSIONS, INITIAL_CARS } from '../constants';

const Admin: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [user, setUser] = useState<any>(() => {
      const saved = localStorage.getItem('ff_user');
      return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const [inventoryCategory, setInventoryCategory] = useState<'tours' | 'transfers' | 'cars'>('tours');
  const [dbStatus, setDbStatus] = useState<string>('checking...');
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [inputHelper, setInputHelper] = useState({
      brlCost: 0,
      arsCost: 0,
      usdCost: 0,
      targetMarginUsd: 0
  });

  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'inventory' | 'guide' | 'destination' | 'seller' | 'hero' | 'banner' | 'reply' | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user, activeTab]);

  const loadData = async () => {
      setDbStatus('Cargando...');
      try {
          if (activeTab === 'inventory') {
              const [trips, cars, excursions] = await Promise.all([
                  getTrips().then(items => items.map(i => ({ ...i, type: 'trip' }))),
                  getCarRentals().then(items => items.map(i => ({ ...i, type: 'car' }))),
                  getExcursions().then(items => items.map(i => ({ ...i, type: 'excursion' })))
              ]);
              setInventory([...trips, ...cars, ...excursions]);
          } else if (activeTab === 'messages') {
              setMessages(await getMessages());
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
          setDbStatus('Error');
          console.error(e);
      }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser = { id: 'admin-1', name: 'Director Floripa Fácil', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('ff_user', JSON.stringify(adminUser));
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (modalType === 'inventory') {
              if (editingItem.type === 'trip') await saveTrip(editingItem);
              else if (editingItem.type === 'car') await saveCarRental(editingItem);
              else if (editingItem.type === 'excursion') await saveExcursion(editingItem);
          } else if (modalType === 'hero') {
              await saveHeroSlide(editingItem);
          } else if (modalType === 'banner') {
              await savePromoBanner(editingItem);
          } else if (modalType === 'destination') {
              await saveDestination(editingItem);
          } else if (modalType === 'guide') {
              await saveGuide(editingItem);
          } else if (modalType === 'seller') {
              await saveSeller(editingItem);
          }
          await loadData();
          setIsModalOpen(false);
          alert("¡Cambios guardados con éxito!");
      } catch (err: any) {
          alert(`Error al guardar: ${err.message}`);
      } finally { setIsSaving(false); }
  };

  const openEdit = (type: any, item: any) => {
      setModalType(type);
      setEditingItem(item);
      
      if (type === 'inventory') {
          const currentPriceUsd = item.providerPrice || item.providerPricePerDay || 0;
          const currentMarginUsd = item.profitMargin || item.profitMarginPerDay || 0;
          setInputHelper({
              brlCost: Number(((currentPriceUsd * 1220) / 260).toFixed(2)),
              arsCost: Number((currentPriceUsd * 1220).toFixed(0)),
              usdCost: currentPriceUsd,
              targetMarginUsd: currentMarginUsd
          });
      }
      setIsModalOpen(true);
      setNewImageUrl('');
  };

  const createNew = (type: string) => {
      let item: any;
      let mType: any = type;
      if (type === 'trip') { item = createEmptyTrip(); mType = 'inventory'; }
      else if (type === 'car') { item = createEmptyCarRental(); mType = 'inventory'; }
      else if (type === 'excursion') { item = createEmptyExcursion(); mType = 'inventory'; }
      else if (type === 'guide') { item = createEmptyGuide(); mType = 'guide'; }
      else if (type === 'destination') { item = createEmptyDestination(); mType = 'destination'; }
      else if (type === 'seller') { item = createEmptySeller(); mType = 'seller'; }
      else if (type === 'hero') { item = { id: Date.now(), image: '', title: '', subtitle: '', ctaText: 'Ver más', ctaLink: '/', highlightColor: 'text-white' }; mType = 'hero'; }
      else if (type === 'banner') { item = { id: 'banner-' + Date.now(), title: '', subtitle: '', image: '', badge: '', ctaText: 'Ver', link: '/' }; mType = 'banner'; }
      
      openEdit(mType, item);
  };

  const handleDelete = async (item: any, type: string) => {
      if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
      setIsSaving(true);
      try {
          if (type === 'trip') await deleteTrip(item.id);
          else if (type === 'car') await deleteCarRental(item.id);
          else if (type === 'excursion') await deleteExcursion(item.id);
          else if (type === 'guide') await deleteGuide(item.id);
          else if (type === 'destination') await deleteDestination(item.id);
          else if (type === 'seller') await deleteSeller(item.id);
          await loadData();
          alert("Eliminado correctamente.");
      } catch (err: any) { alert(err.message); }
      finally { setIsSaving(false); }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md animate-pop-in">
                <div className="text-center mb-8">
                    <img src={LOGO_URL} className="h-32 mx-auto mb-4 rounded-full border-4 border-green-500 bg-white p-2" alt="Logo" />
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Acceso<br/>Panel Floripa</h2>
                </div>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border-2 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border-2 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required />
                  <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest text-sm shadow-xl">Entrar</button>
                </div>
            </form>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col h-screen md:sticky md:top-0 shrink-0">
          <div className="p-8 text-center border-b border-white/5">
              <img src={LOGO_URL} className="w-16 h-16 mx-auto rounded-full mb-4 border-2 border-green-500 bg-white p-1" alt="Logo" />
              <p className="text-[9px] font-black uppercase tracking-widest text-green-400">Panel v2.0 - {dbStatus}</p>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {[
                  { id: 'messages', label: '📩 Mensajería', icon: '📩' },
                  { id: 'inventory', label: '🎒 Inventario', icon: '🎒' },
                  { id: 'home', label: '🏠 Gestión Home', icon: '🏠' },
                  { id: 'destinations', label: '📍 Destinos', icon: '📍' },
                  { id: 'guides', label: '🌍 Guías', icon: '🌍' },
                  { id: 'sales', label: '💰 Ventas', icon: '💰' },
                  { id: 'sellers', label: '👥 Vendedores', icon: '👥' },
              ].map(tab => (
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full flex items-center px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab===tab.id ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                    {tab.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-white/5">
                <button onClick={()=>{localStorage.removeItem('ff_user'); window.location.reload();}} className="w-full text-left px-6 py-4 text-[10px] font-black text-red-400 hover:bg-red-400/10 rounded-2xl uppercase tracking-widest">🚪 Salir</button>
              </div>
          </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Mensajes Recibidos</h1>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                      {messages.map(msg => (
                          <div key={msg.id} className={`p-6 bg-white rounded-3xl border ${msg.is_read ? 'border-slate-100 opacity-70' : 'border-green-200 shadow-md'}`}>
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded">{msg.type}</span>
                                      <h3 className="font-black text-lg text-slate-800 mt-2">{msg.subject}</h3>
                                      <p className="text-xs text-slate-400 font-bold">De: {msg.sender_name} | {new Date(msg.created_at).toLocaleString()}</p>
                                  </div>
                                  {!msg.is_read && <button onClick={()=>markAsRead(msg.id)} className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Leído</button>}
                              </div>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">{msg.body}</p>
                              <div className="mt-4 flex justify-end">
                                  <button onClick={()=>deleteMessage(msg.id).then(loadData)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Eliminar registro</button>
                              </div>
                          </div>
                      ))}
                      {messages.length === 0 && <p className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">Sin mensajes nuevos</p>}
                  </div>
              </div>
          )}

          {/* TAB: INVENTORY */}
          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-end">
                      <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Inventario de Servicios</h1>
                        <div className="flex gap-2 mt-4">
                            {['tours', 'transfers', 'cars'].map(cat => (
                                <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryCategory === cat ? 'bg-slate-800 text-white' : 'bg-white border text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                      </div>
                      <button onClick={()=>createNew(inventoryCategory === 'tours' ? 'trip' : inventoryCategory === 'transfers' ? 'excursion' : 'car')} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all">+ Añadir {inventoryCategory}</button>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="p-6">Servicio</th>
                                  <th className="p-6 text-right">Precio Venta (USD)</th>
                                  <th className="p-6 text-right">Acciones</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {inventory.filter(i => inventoryCategory === 'tours' ? i.type === 'trip' : inventoryCategory === 'transfers' ? i.type === 'excursion' : i.type === 'car').map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images?.[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-tight">{item.brand ? `${item.brand} ${item.title}` : item.title}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">📍 {item.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-black text-green-700">
                                        {formatPrice((item.providerPrice || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerDay || 0), 'USD')}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={()=>openEdit('inventory', item)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-green-100 transition-all">✏️</button>
                                            <button onClick={()=>handleDelete(item, item.type)} className="p-2 bg-slate-100 text-red-400 rounded-lg hover:bg-red-100 transition-all">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* TAB: HOME MANAGEMENT */}
          {activeTab === 'home' && (
              <div className="space-y-12 animate-fade-in">
                  <section>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic">Hero Slides (Carrusel)</h2>
                        <button onClick={()=>createNew('hero')} className="bg-slate-800 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Nuevo Slide</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {heroSlides.map(slide => (
                              <div key={slide.id} className="bg-white p-4 rounded-3xl border flex gap-4 items-center">
                                  <img src={slide.image} className="w-20 h-20 rounded-2xl object-cover" />
                                  <div className="flex-1">
                                      <p className="font-black text-sm uppercase">{slide.title}</p>
                                      <p className="text-[10px] text-gray-400 line-clamp-1">{slide.subtitle}</p>
                                  </div>
                                  <button onClick={()=>openEdit('hero', slide)} className="p-2 bg-slate-100 rounded-lg">✏️</button>
                              </div>
                          ))}
                      </div>
                  </section>

                  <section>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic">Promo Banners</h2>
                        <button onClick={()=>createNew('banner')} className="bg-slate-800 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Nuevo Banner</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {promoBanners.map(banner => (
                              <div key={banner.id} className="bg-white p-4 rounded-3xl border flex gap-4 items-center">
                                  <img src={banner.image} className="w-20 h-20 rounded-2xl object-cover" />
                                  <div className="flex-1">
                                      <p className="font-black text-sm uppercase">{banner.title}</p>
                                      <p className="text-[10px] text-green-600 font-bold uppercase">{banner.badge}</p>
                                  </div>
                                  <button onClick={()=>openEdit('banner', banner)} className="p-2 bg-slate-100 rounded-lg">✏️</button>
                              </div>
                          ))}
                      </div>
                  </section>
              </div>
          )}

          {/* TAB: DESTINATIONS */}
          {activeTab === 'destinations' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Destinos Activos</h1>
                    <button onClick={()=>createNew('destination')} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ Nuevo Destino</button>
                  </div>
                  <div className="bg-white rounded-3xl border overflow-hidden">
                      <table className="w-full text-left">
                          <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-6">Nombre</th><th className="p-6">Estado</th><th className="p-6 text-right">Acciones</th></tr></thead>
                          <tbody className="divide-y divide-slate-50">
                              {destinations.map(d => (
                                  <tr key={d.id}>
                                      <td className="p-6 font-black text-slate-800">{d.name}</td>
                                      <td className="p-6">
                                          <span className={`text-[9px] font-black px-2 py-1 rounded-full ${d.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{d.active ? 'ACTIVO' : 'INACTIVO'}</span>
                                      </td>
                                      <td className="p-6 text-right">
                                          <button onClick={()=>openEdit('destination', d)} className="p-2 bg-slate-100 rounded-lg mr-2">✏️</button>
                                          <button onClick={()=>handleDelete(d, 'destination')} className="p-2 bg-slate-100 text-red-400 rounded-lg">🗑️</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* TAB: GUIDES */}
          {activeTab === 'guides' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Guías de Viaje</h1>
                    <button onClick={()=>createNew('guide')} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ Crear Guía</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {guides.map(g => (
                          <div key={g.id} className="bg-white p-6 rounded-[2rem] border shadow-sm flex gap-6 items-center group">
                              <img src={g.images?.[0]} className="w-24 h-24 rounded-[1.5rem] object-cover" />
                              <div className="flex-1">
                                  <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg leading-none">{g.name}</h3>
                                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">{g.summary}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                  <button onClick={()=>openEdit('guide', g)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">✏️</button>
                                  <button onClick={()=>handleDelete(g, 'guide')} className="p-3 bg-slate-50 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* TAB: SALES */}
          {activeTab === 'sales' && (
              <div className="space-y-8 animate-fade-in">
                  <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Monitor de Ventas</h1>
                  <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                          <thead><tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="p-6">Vendedor</th><th className="p-6">Cliente</th><th className="p-6 text-right">Total</th><th className="p-6 text-right">Comisión Agente</th></tr></thead>
                          <tbody className="divide-y divide-slate-50">
                              {sales.map((sale: any) => (
                                  <tr key={sale.id}>
                                      <td className="p-6"><p className="font-black text-slate-800 text-xs">{sale.seller_name}</p></td>
                                      <td className="p-6"><p className="text-xs font-bold text-gray-500">{sale.client_name}</p></td>
                                      <td className="p-6 text-right font-black text-slate-800">{formatPrice(sale.total_amount, 'ARS')}</td>
                                      <td className="p-6 text-right font-black text-green-600">{formatPrice(sale.commission_amount, 'ARS')}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* TAB: SELLERS */}
          {activeTab === 'sellers' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Agentes Floripa Fácil</h1>
                    <button onClick={()=>createNew('seller')} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">+ Nuevo Agente</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sellers.map(s => (
                          <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl">👤</div>
                                  <div>
                                      <p className="font-black text-slate-800 uppercase tracking-widest text-sm">{s.name}</p>
                                      <p className="text-[10px] text-green-600 font-bold">{s.role.toUpperCase()}</p>
                                  </div>
                              </div>
                              <div className="space-y-2 mb-6">
                                  <p className="text-xs font-bold text-gray-500 flex justify-between">Email: <span className="text-slate-800">{s.email}</span></p>
                                  <p className="text-xs font-bold text-gray-500 flex justify-between">WhatsApp: <span className="text-slate-800">{s.phone}</span></p>
                                  <p className="text-xs font-bold text-gray-500 flex justify-between">Comisión: <span className="text-green-600 font-black">{s.commissionRate}%</span></p>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={()=>openEdit('seller', s)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all">Editar</button>
                                  <button onClick={()=>handleDelete(s, 'seller')} className="px-4 py-3 bg-red-50 text-red-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-100 transition-all">🗑️</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </main>

      {/* MODAL GLOBAL DE EDICIÓN */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Editor Floripa Fácil - {modalType?.toUpperCase()}</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">×</button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-8">
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* CAMPOS COMUNES SEGÚN TIPO */}
                        {modalType === 'inventory' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-[2rem] border-2 border-green-200">
                                    <h4 className="text-xs font-black text-green-800 uppercase mb-6 tracking-widest">💸 Calculadora de Costos y Venta</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Costo (USD)</label>
                                            <input type="number" step="any" className="w-full bg-white p-4 rounded-2xl font-black border-2 border-slate-100" value={editingItem.providerPrice || editingItem.providerPricePerDay || 0} onChange={e=>{
                                                const val = Number(e.target.value);
                                                setEditingItem(prev => ({...prev, [prev.type==='car'?'providerPricePerDay':'providerPrice']: val}));
                                            }} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Margen Ganancia (USD)</label>
                                            <input type="number" step="any" className="w-full bg-white p-4 rounded-2xl font-black border-2 border-slate-100 text-green-600" value={editingItem.profitMargin || editingItem.profitMarginPerDay || 0} onChange={e=>{
                                                const val = Number(e.target.value);
                                                setEditingItem(prev => ({...prev, [prev.type==='car'?'profitMarginPerDay':'profitMargin']: val}));
                                            }} />
                                        </div>
                                        <div className="md:col-span-2 bg-white p-4 rounded-2xl border-4 border-green-500 flex flex-col justify-center text-center">
                                            <span className="text-[10px] font-black text-green-600 uppercase mb-1">PVP WEB (USD)</span>
                                            <span className="text-3xl font-black text-slate-800">
                                                {formatPrice((editingItem.providerPrice || editingItem.providerPricePerDay || 0) + (editingItem.profitMargin || editingItem.profitMarginPerDay || 0), 'USD')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Título</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Localidad</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} /></div>
                                </div>
                            </div>
                        )}

                        {modalType === 'guide' && (
                            <div className="space-y-6">
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nombre del Destino</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Resumen Corto</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.summary} onChange={e=>setEditingItem({...editingItem, summary: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Video URL (YouTube)</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.videoUrl || ''} onChange={e=>setEditingItem({...editingItem, videoUrl: e.target.value})} /></div>
                            </div>
                        )}

                        {modalType === 'destination' && (
                            <div className="space-y-6">
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nombre del Destino</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} /></div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="w-5 h-5" checked={editingItem.active} onChange={e=>setEditingItem({...editingItem, active: e.target.checked})} />
                                    <label className="font-bold text-slate-700">Destino Activo en Web</label>
                                </div>
                            </div>
                        )}

                        {modalType === 'hero' && (
                             <div className="grid grid-cols-1 gap-6">
                                 <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Imagen URL</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.image} onChange={e=>setEditingItem({...editingItem, image: e.target.value})} /></div>
                                 <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Título Grande</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} /></div>
                                 <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Subtítulo</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.subtitle} onChange={e=>setEditingItem({...editingItem, subtitle: e.target.value})} /></div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Texto Botón</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.ctaText} onChange={e=>setEditingItem({...editingItem, ctaText: e.target.value})} /></div>
                                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Link Botón</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.ctaLink} onChange={e=>setEditingItem({...editingItem, ctaLink: e.target.value})} /></div>
                                 </div>
                             </div>
                        )}

                        {modalType === 'banner' && (
                             <div className="grid grid-cols-1 gap-6">
                                 <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Imagen URL</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.image} onChange={e=>setEditingItem({...editingItem, image: e.target.value})} /></div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Badge (Texto pequeño arriba)</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.badge} onChange={e=>setEditingItem({...editingItem, badge: e.target.value})} /></div>
                                     <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Título Banner</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} /></div>
                                 </div>
                                 <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Descripción Corta</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.subtitle} onChange={e=>setEditingItem({...editingItem, subtitle: e.target.value})} /></div>
                             </div>
                        )}

                        {modalType === 'seller' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Nombre</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Email</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.email} onChange={e=>setEditingItem({...editingItem, email: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">WhatsApp (+54...)</label><input className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.phone} onChange={e=>setEditingItem({...editingItem, phone: e.target.value})} /></div>
                                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-400 ml-4">Comisión Agente (%)</label><input type="number" className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={editingItem.commissionRate} onChange={e=>setEditingItem({...editingItem, commissionRate: Number(e.target.value)})} /></div>
                            </div>
                        )}

                        {/* GALERÍA GENÉRICA PARA ELEMENTOS QUE TENGAN IMÁGENES */}
                        {(editingItem.images !== undefined) && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest ml-4">Galería de Imágenes</h4>
                                <div className="flex gap-4">
                                    <input value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold" placeholder="URL de la imagen..." />
                                    <button type="button" onClick={()=>{ if(newImageUrl){ setEditingItem({...editingItem, images: [...(editingItem.images||[]), newImageUrl]}); setNewImageUrl(''); } }} className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px]">Añadir</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {(editingItem.images || []).map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-md">
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                            <div onClick={()=>{ const imgs=[...editingItem.images]; imgs.splice(idx,1); setEditingItem({...editingItem, images: imgs}); }} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer font-black text-[10px]">BORRAR</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DESCRIPCIÓN LARGA */}
                        {editingItem.description !== undefined && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Descripción Completa</label>
                                <textarea rows={6} className="w-full bg-slate-50 p-6 rounded-[2rem] font-bold outline-none border-2 border-transparent focus:border-green-500" value={editingItem.description} onChange={e=>setEditingItem({...editingItem, description: e.target.value})} />
                            </div>
                        )}

                        <div className="flex justify-end gap-4 border-t pt-8">
                            <button type="button" onClick={()=>setIsModalOpen(false)} className="px-10 py-4 font-black text-slate-400 uppercase text-[10px]">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-3xl font-black uppercase text-[10px] shadow-xl hover:bg-green-700 transition-all">
                                {isSaving ? 'Guardando...' : '💾 Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
