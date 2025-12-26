
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, AppMessage, HeroSlide, PromoBanner } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, deleteDestination, createEmptyDestination } from '../services/destinationService';
import { getSellers, saveSeller, deleteSeller, createEmptySeller } from '../services/sellerService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner } from '../services/heroService';
import { getMessages, markAsRead, deleteMessage } from '../services/messageService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';
import { LOGO_URL } from '../constants';

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
  const [dbStatus, setDbStatus] = useState<{[key: string]: 'online' | 'error' | 'loading'}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadTabData();
  }, [user, activeTab]);

  const updateStatus = (key: string, status: 'online' | 'error' | 'loading') => {
      setDbStatus(prev => ({ ...prev, [key]: status }));
  };

  const loadTabData = async () => {
      updateStatus(activeTab, 'loading');
      try {
          switch (activeTab) {
              case 'inventory':
                  const [t, c, e] = await Promise.all([getTrips(), getCarRentals(), getExcursions()]);
                  setInventory([...t.map(i=>({...i, type:'trip'})), ...c.map(i=>({...i, type:'car'})), ...e.map(i=>({...i, type:'excursion'}))]);
                  break;
              case 'messages':
                  setMessages(await getMessages());
                  break;
              case 'home':
                  setHeroSlides(await getHeroSlides());
                  setPromoBanners(await getPromoBanners());
                  break;
              case 'destinations':
                  setDestinations(await getDestinations());
                  break;
              case 'guides':
                  setGuides(await getGuides());
                  break;
              case 'sellers':
                  setSellers(await getSellers());
                  break;
              case 'sales':
                  const { data } = await supabase.from('sales').select('*').order('date', { ascending: false });
                  setSales(data || []);
                  break;
          }
          updateStatus(activeTab, 'online');
      } catch (err) {
          console.error(err);
          updateStatus(activeTab, 'error');
      }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser = { name: 'Director Floripa Fácil', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('ff_user', JSON.stringify(adminUser));
    } else alert("Credenciales incorrectas.");
  };

  const openEdit = (type: string, item: any) => {
      setModalType(type);
      setEditingItem({...item});
      setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (modalType === 'inventory') {
              if (editingItem.type === 'trip') await saveTrip(editingItem);
              else if (editingItem.type === 'car') await saveCarRental(editingItem);
              else if (editingItem.type === 'excursion') await saveExcursion(editingItem);
          } else if (modalType === 'hero') await saveHeroSlide(editingItem);
          else if (modalType === 'banner') await savePromoBanner(editingItem);
          else if (modalType === 'destination') await saveDestination(editingItem);
          else if (modalType === 'guide') await saveGuide(editingItem);
          else if (modalType === 'seller') await saveSeller(editingItem);

          await loadTabData();
          setIsModalOpen(false);
          alert("¡Guardado correctamente!");
      } catch (err: any) {
          alert(`Error al guardar: ${err.message}. Asegúrate de que las tablas existan en Supabase.`);
      } finally { setIsSaving(false); }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#064E3B] p-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop')] bg-cover opacity-20"></div>
            <form onSubmit={handleLogin} className="bg-white/90 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up border border-white/30">
                <div className="text-center mb-10">
                    <img src={LOGO_URL} className="h-24 mx-auto mb-6 rounded-3xl shadow-lg border-2 border-green-100 p-2 bg-white" alt="Logo" />
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Acceso<br/><span className="text-green-600">Director</span></h2>
                </div>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50/50 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-green-600 font-bold transition-all" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50/50 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-green-600 font-bold transition-all" required />
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-[0.2em] text-xs shadow-xl btn-premium mt-4">Entrar al Sistema</button>
                </div>
            </form>
        </div>
    );
  }

  const SidebarItem = ({id, label, icon}: any) => (
    <button 
        onClick={()=>setActiveTab(id)} 
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab===id ? 'bg-white text-green-900 shadow-xl scale-105' : 'hover:bg-white/5 text-green-100/60'}`}
    >
        <span className="text-lg">{icon}</span> {label}
        {dbStatus[id] === 'error' && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Error de tabla"></span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Boutique */}
      <aside className="w-full md:w-80 bg-gradient-to-b from-[#064E3B] to-[#042F24] text-white flex flex-col h-screen md:sticky md:top-0 shrink-0 shadow-2xl z-20">
          <div className="p-10 text-center border-b border-white/5">
              <img src={LOGO_URL} className="w-20 h-20 mx-auto rounded-3xl mb-4 border-2 border-white/20 bg-white p-2" alt="Logo" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400">Panel Director v3.0</p>
          </div>
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
              <SidebarItem id="messages" label="Mensajería" icon="✉️" />
              <SidebarItem id="inventory" label="Inventario" icon="🎒" />
              <SidebarItem id="home" label="Gestión Home" icon="🏠" />
              <SidebarItem id="destinations" label="Destinos" icon="📍" />
              <SidebarItem id="guides" label="Guías Viaje" icon="📖" />
              <SidebarItem id="sales" label="Ventas" icon="💰" />
              <SidebarItem id="sellers" label="Agentes" icon="👥" />
              
              <div className="pt-6 mt-6 border-t border-white/5">
                <button onClick={()=>{localStorage.removeItem('ff_user'); window.location.reload();}} className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black text-red-300 hover:bg-red-400/10 rounded-2xl uppercase tracking-[0.2em] transition-all">🚪 Cerrar Sesión</button>
              </div>
          </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto">
          {dbStatus[activeTab] === 'error' && (
              <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2rem] mb-10 flex items-center gap-6 animate-slide-up">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">⚠️</div>
                  <div>
                      <h4 className="font-black text-red-800 uppercase tracking-widest text-sm">Error de Base de Datos</h4>
                      <p className="text-red-600 text-sm font-medium">La tabla <b>{activeTab === 'home' ? 'hero_slides' : activeTab}</b> no existe en tu esquema de Supabase. Créala para activar esta sección.</p>
                  </div>
              </div>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
              <div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mb-3 block">Administración Central</span>
                <h1 className="text-5xl font-black text-slate-800 tracking-tightest uppercase italic leading-none">{activeTab}</h1>
              </div>
              <div className="flex gap-3">
                  {['inventory', 'home', 'destinations', 'guides', 'sellers'].includes(activeTab) && (
                      <button onClick={()=>{
                          if(activeTab === 'home') openEdit('hero', {id: Date.now(), title:'', subtitle:'', image:'', ctaText:'Ver más', ctaLink:'/'});
                          else if(activeTab === 'inventory') openEdit('inventory', createEmptyTrip());
                          else if(activeTab === 'destinations') openEdit('destination', createEmptyDestination());
                          else if(activeTab === 'guides') openEdit('guide', createEmptyGuide());
                          else if(activeTab === 'sellers') openEdit('seller', createEmptySeller());
                      }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl btn-premium">+ Crear Nuevo</button>
                  )}
                  <button onClick={loadTabData} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">🔄</button>
              </div>
          </div>

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
              <div className="grid grid-cols-1 gap-6 animate-slide-up">
                  {messages.map(msg => (
                      <div key={msg.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">{msg.type}</span>
                                  <h3 className="text-xl font-black text-slate-800 mt-2 uppercase italic">{msg.subject}</h3>
                                  <p className="text-xs text-slate-400 font-bold mt-1">De: {msg.sender_name} • {new Date(msg.created_at).toLocaleString()}</p>
                              </div>
                              {!msg.is_read && <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-200"></span>}
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl italic border border-slate-100">{msg.body}</p>
                      </div>
                  ))}
                  {messages.length === 0 && <p className="text-center py-20 text-slate-300 font-black uppercase tracking-[0.3em]">Bandeja de entrada vacía</p>}
              </div>
          )}

          {/* TAB: INVENTORY */}
          {activeTab === 'inventory' && (
              <div className="space-y-10 animate-slide-up">
                  <div className="flex gap-2 bg-white p-2 rounded-2xl border w-fit shadow-sm">
                      {['tours', 'transfers', 'cars'].map(cat => (
                          <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryCategory===cat ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{cat}</button>
                      ))}
                  </div>
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                          <thead><tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b"><th className="p-8">Servicio</th><th className="p-8 text-right">Inversión (USD)</th><th className="p-8 text-right">Gestión</th></tr></thead>
                          <tbody className="divide-y divide-slate-50">
                              {inventory.filter(i => inventoryCategory === 'tours' ? i.type === 'trip' : inventoryCategory === 'transfers' ? i.type === 'excursion' : i.type === 'car').map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/30 transition-all">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <img src={item.images?.[0]} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" />
                                            <div>
                                                <p className="font-black text-slate-800 text-base leading-tight uppercase italic">{item.brand ? `${item.brand} ${item.title}` : item.title}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">📍 {item.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right"><span className="text-xl font-black text-green-700 tracking-tighter">{formatPrice((item.providerPrice || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerDay || 0), 'USD')}</span></td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={()=>openEdit('inventory', item)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">✏️</button>
                                            <button onClick={()=>alert("Eliminar")} className="p-3 bg-slate-100 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all">🗑️</button>
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
              <div className="space-y-20 animate-slide-up">
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-8 tracking-tighter border-l-4 border-green-600 pl-6">Hero Slides (Gran Carrusel)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {heroSlides.map(slide => (
                              <div key={slide.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all">
                                  <div className="h-56 rounded-[2rem] overflow-hidden relative">
                                      <img src={slide.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-8 text-center">
                                          <h4 className="text-white font-black uppercase text-xl italic">{slide.title}</h4>
                                      </div>
                                  </div>
                                  <div className="flex justify-between items-center px-2">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {slide.id}</p>
                                      <div className="flex gap-2">
                                          <button onClick={()=>openEdit('hero', slide)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Editar</button>
                                          <button className="p-2 bg-red-50 text-red-400 rounded-xl">🗑️</button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </section>
                  <section>
                      <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-8 tracking-tighter border-l-4 border-green-600 pl-6">Banner Promocionales</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {promoBanners.map(banner => (
                              <div key={banner.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                                  <img src={banner.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                                  <div className="flex-1">
                                      <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">{banner.badge}</span>
                                      <h4 className="font-black text-slate-800 uppercase italic">{banner.title}</h4>
                                  </div>
                                  <button onClick={()=>openEdit('banner', banner)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">✏️</button>
                              </div>
                          ))}
                      </div>
                  </section>
              </div>
          )}

          {/* TAB: DESTINATIONS */}
          {activeTab === 'destinations' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                  {destinations.map(d => (
                      <div key={d.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center group">
                          <div>
                              <h4 className="text-xl font-black text-slate-800 uppercase italic">{d.name}</h4>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-2 inline-block ${d.active ? 'bg-green-100 text-green-600':'bg-red-100 text-red-600'}`}>{d.active?'ACTIVO':'INACTIVO'}</span>
                          </div>
                          <button onClick={()=>openEdit('destination', d)} className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shadow-inner">✏️</button>
                      </div>
                  ))}
              </div>
          )}

          {/* TAB: GUIDES */}
          {activeTab === 'guides' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
                  {guides.map(g => (
                      <div key={g.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex gap-8 items-center group hover:shadow-xl transition-all overflow-hidden relative">
                          <img src={g.images?.[0]} className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-lg transition-transform group-hover:rotate-3" />
                          <div className="flex-1">
                              <h4 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-3">{g.name}</h4>
                              <p className="text-xs text-slate-400 font-medium line-clamp-2 italic">{g.summary}</p>
                              <div className="flex gap-2 mt-4">
                                  <button onClick={()=>openEdit('guide', g)} className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline">Editar Guía Completa</button>
                              </div>
                          </div>
                          <button className="absolute top-4 right-4 p-3 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                      </div>
                  ))}
              </div>
          )}
      </main>

      {/* MODAL GLOBAL DE EDICIÓN BOUTIQUE */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                <div className="p-10 border-b bg-slate-50 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] block mb-2">Editor Avanzado</span>
                        <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">{modalType} / {editingItem.title || editingItem.name}</h3>
                    </div>
                    <button onClick={()=>setIsModalOpen(false)} className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all text-2xl">×</button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-10 scrollbar-hide">
                    <form onSubmit={handleSave} className="space-y-10">
                        {/* FORMULARIO ADAPTATIVO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {Object.keys(editingItem).filter(k => ['title', 'name', 'location', 'subtitle', 'ctaText', 'ctaLink', 'badge', 'link', 'email', 'phone', 'summary'].includes(k)).map(key => (
                                 <div key={key} className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{key}</label>
                                     <input className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:border-green-500 transition-all outline-none" value={editingItem[key] || ''} onChange={e=>setEditingItem({...editingItem, [key]: e.target.value})} />
                                 </div>
                             ))}
                             {editingItem.active !== undefined && (
                                 <div className="flex items-center gap-4 mt-8">
                                     <input type="checkbox" className="w-8 h-8 rounded-lg text-green-600 focus:ring-green-500 border-2 border-slate-200" checked={editingItem.active} onChange={e=>setEditingItem({...editingItem, active: e.target.checked})} />
                                     <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Activo en la Web</label>
                                 </div>
                             )}
                        </div>

                        {/* GALERÍA */}
                        {editingItem.images !== undefined && (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Galería de Imágenes</label>
                                <div className="flex gap-4">
                                    <input value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} className="flex-1 bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold" placeholder="URL de nueva imagen..." />
                                    <button type="button" onClick={()=>{ if(newImageUrl){ setEditingItem({...editingItem, images: [...(editingItem.images||[]), newImageUrl]}); setNewImageUrl(''); } }} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Añadir</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                                    {(editingItem.images || []).map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square rounded-[1.5rem] overflow-hidden shadow-sm border-2 border-white">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <div onClick={()=>{ const imgs=[...editingItem.images]; imgs.splice(idx,1); setEditingItem({...editingItem, images: imgs}); }} className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer font-black text-[9px] uppercase tracking-widest transition-all">BORRAR</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 border-t pt-10">
                            <button type="button" onClick={()=>setIsModalOpen(false)} className="px-12 py-5 font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">Cerrar</button>
                            <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl btn-premium">
                                {isSaving ? 'Guardando...' : 'Confirmar Cambios'}
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
