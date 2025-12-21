
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
  const [user, setUser] = useState<Seller | null>(() => {
      const saved = localStorage.getItem('abras_user');
      return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('messages');
  const [inventoryCategory, setInventoryCategory] = useState<'tours' | 'transfers' | 'cars'>('tours');
  const [messageFilter, setMessageFilter] = useState<'all' | 'contact' | 'booking' | 'internal'>('all');
  const [dbStatus, setDbStatus] = useState<string>('checking...');
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Helper para importación de proveedores (BRL mensual -> Daily USD)
  const [monthlyBrlProvider, setMonthlyBrlProvider] = useState<number>(0);

  // Data States
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'inventory' | 'guide' | 'destination' | 'seller' | 'hero' | 'banner' | 'reply' | null>(null);
  const [replyBody, setReplyBody] = useState('');

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
              setDestinations(await getDestinations());
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
          setDbStatus('Error de conexión');
          console.error(e);
      }
  };

  const scrubItem = (item: any) => {
      const { type, calculatedPrice, calculatedProfit, ...cleaned } = item;
      return cleaned;
  };

  const handleSyncDefaults = async () => {
      if (!window.confirm("¿Deseas realizar la CARGA MASIVA de productos iniciales? Esto actualizará Tours, Traslados y Autos.")) return;
      setIsSaving(true);
      try {
          const defaultDests = [
              { id: 'dest-1', name: 'Florianópolis', active: true },
              { id: 'dest-2', name: 'Bombinhas', active: true },
              { id: 'dest-3', name: 'Camboriú', active: true }
          ];
          await supabase.from('destinations').upsert(defaultDests);
          const cleanTrips = INITIAL_TRIPS.map(scrubItem);
          const cleanExcursions = INITIAL_EXCURSIONS.map(scrubItem);
          const cleanCars = INITIAL_CARS.map(scrubItem);
          await Promise.all([
            supabase.from('trips').upsert(cleanTrips),
            supabase.from('excursions').upsert(cleanExcursions),
            supabase.from('cars').upsert(cleanCars)
          ]);
          alert("¡CARGA MASIVA EXITOSA!");
          loadData();
      } catch (err: any) {
          alert("Error al sincronizar datos: " + err.message);
      } finally { setIsSaving(false); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser: any = { id: 'admin-1', name: 'Director ABRAS', role: 'admin' };
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
          const cleanItem = scrubItem(editingItem);
          if (modalType === 'inventory') {
              const type = editingItem.type; 
              if (type === 'trip') await saveTrip(cleanItem);
              else if (type === 'car') await saveCarRental(cleanItem);
              else if (type === 'excursion') await saveExcursion(cleanItem);
          } else if (modalType === 'reply') {
              await sendMessage({
                  sender_name: user?.name,
                  sender_id: user?.id,
                  subject: `RE: ${editingItem.subject}`,
                  body: replyBody,
                  type: 'internal',
                  receiver_id: editingItem.sender_id
              });
              setReplyBody('');
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
          alert("¡Acción completada!");
      } catch (err: any) {
          alert(`Error: ${err.message}`);
      } finally { setIsSaving(false); }
  };

  const openEdit = (type: any, item: any) => {
      setModalType(type);
      setEditingItem(item);
      setIsModalOpen(true);
      setNewImageUrl('');
      setMonthlyBrlProvider(0);
  };

  const handleReadMessage = async (msg: AppMessage) => {
      if (!msg.is_read) {
          await markAsRead(msg.id);
          loadData();
      }
      openEdit('reply', msg);
  };

  const addImageToEditingItem = () => {
    if (!newImageUrl) return;
    const currentImages = editingItem.images || [];
    setEditingItem({
        ...editingItem,
        images: [...currentImages, newImageUrl]
    });
    setNewImageUrl('');
  };

  const removeImageFromEditingItem = (index: number) => {
    const currentImages = [...(editingItem.images || [])];
    currentImages.splice(index, 1);
    setEditingItem({
        ...editingItem,
        images: currentImages
    });
  };

  const applyProviderConversion = () => {
      if (monthlyBrlProvider <= 0) return;
      // Lógica: Mensual BRL -> Diario BRL -> Diario ARS -> Diario USD (base del sistema)
      const dailyBrl = monthlyBrlProvider / 30;
      const dailyArs = dailyBrl * 260; // Tasa solicitada por el usuario
      const dailyUsd = dailyArs / 1220; // Tasa base del sistema
      
      setEditingItem({
          ...editingItem,
          providerPricePerDay: Number(dailyUsd.toFixed(2))
      });
      alert(`Conversión aplicada: Costo diario estimado en USD ${dailyUsd.toFixed(2)}`);
  };

  const filteredMessages = messages.filter(m => messageFilter === 'all' || m.type === messageFilter);
  const unreadCount = messages.filter(m => !m.is_read).length;

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
              <button onClick={()=>setActiveTab('messages')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='messages' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                  <span className="flex items-center gap-3">📩 Mensajería</span>
                  {unreadCount > 0 && <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full animate-pulse">{unreadCount}</span>}
              </button>
              <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>🎒 Inventario</button>
              <button onClick={()=>setActiveTab('home')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='home' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>🏠 Gestión Home</button>
              <button onClick={()=>setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='destinations' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>📍 Destinos</button>
              <button onClick={()=>setActiveTab('guides')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='guides' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>🌍 Guías</button>
              <button onClick={()=>setActiveTab('sales')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sales' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>💰 Ventas</button>
              <button onClick={()=>setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='sellers' ? 'bg-green-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>👥 Vendedores</button>
              <div className="pt-4 mt-4 border-t border-white/5">
                <button onClick={handleSyncDefaults} disabled={isSaving} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-400/10 rounded-2xl">⚙️ Reparar Base de Datos</button>
                <button onClick={()=>{localStorage.removeItem('abras_user'); window.location.reload();}} className="w-full text-left px-6 py-4 text-[10px] font-black text-red-400 hover:bg-red-400/10 rounded-2xl uppercase tracking-widest mt-2">🚪 Cerrar Sesión</button>
              </div>
          </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'messages' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Centro de Comunicaciones</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                {id: 'all', label: 'Todos', icon: '📥'},
                                {id: 'contact', label: 'Clientes', icon: '👤'},
                                {id: 'booking', label: 'Reservas', icon: '✅'},
                                {id: 'internal', label: 'Interno', icon: '💬'}
                            ].map(cat => (
                                <button key={cat.id} onClick={()=>setMessageFilter(cat.id as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${messageFilter === cat.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 text-slate-400'}`}>
                                    <span>{cat.icon}</span> {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={()=>openEdit('reply', { sender_name: 'Staff', subject: 'Mensaje Interno', type: 'internal' })} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all">Redactar Interno</button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <div className="divide-y divide-slate-50">
                          {filteredMessages.map(msg => (
                              <div key={msg.id} onClick={() => handleReadMessage(msg)} className={`p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group ${!msg.is_read ? 'bg-green-50/30' : ''}`}>
                                  <div className="flex items-center gap-4 flex-1">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl ${
                                          msg.type === 'contact' ? 'bg-blue-100 text-blue-600' : 
                                          msg.type === 'booking' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                      }`}>
                                          {msg.type === 'contact' ? '✉️' : msg.type === 'booking' ? '💰' : '💬'}
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{msg.sender_name}</p>
                                              {!msg.is_read && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                          </div>
                                          <p className="text-xs font-bold text-slate-500">{msg.subject}</p>
                                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{msg.body}</p>
                                      </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 text-right">
                                      <p className="text-[10px] font-black text-slate-300 uppercase">{new Date(msg.created_at).toLocaleDateString()}</p>
                                      <button onClick={(e)=>{e.stopPropagation(); deleteMessage(msg.id).then(loadData);}} className="text-slate-200 hover:text-red-500 transition-colors mt-1 opacity-0 group-hover:opacity-100">Eliminar</button>
                                  </div>
                              </div>
                          ))}
                          {filteredMessages.length === 0 && (
                              <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Bandeja de entrada vacía</div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Control de Inventario</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['tours', 'transfers', 'cars'].map(cat => (
                                <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            if (inventoryCategory === 'tours') openEdit('inventory', createEmptyTrip());
                            else if (inventoryCategory === 'transfers') openEdit('inventory', createEmptyExcursion());
                            else openEdit('inventory', createEmptyCarRental());
                        }} 
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all"
                    >
                        + Crear Nuevo
                    </button>
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
                              {inventory.filter(i => 
                                  inventoryCategory === 'tours' ? i.type === 'trip' : 
                                  inventoryCategory === 'transfers' ? i.type === 'excursion' : i.type === 'car'
                              ).map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images?.[0] || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-tight">{item.brand ? `${item.brand} ${item.title}` : item.title}</p>
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
                                        <button onClick={async ()=>{if(window.confirm('¿Eliminar definitivamente?')) {await (item.type === 'trip' ? deleteTrip(item.id) : item.type === 'car' ? deleteCarRental(item.id) : deleteExcursion(item.id)); loadData();}}} className="p-2 bg-slate-100 text-slate-300 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all">🗑️</button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'sales' && (
              <div className="space-y-8 animate-fade-in">
                  <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Registro de Ventas</h1>
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="p-6">Vendedor</th>
                                  <th className="p-6">Cliente</th>
                                  <th className="p-6 text-right">Total</th>
                                  <th className="p-6 text-right">Comisión (40%)</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td className="p-6"><span className="font-black text-xs uppercase text-slate-700">{sale.seller_name}</span></td>
                                    <td className="p-6"><div><p className="font-bold text-sm">{sale.client_name}</p><p className="text-[10px] text-slate-400">{sale.client_phone}</p></div></td>
                                    <td className="p-6 text-right font-black text-slate-800">{formatPrice(sale.total_amount)}</td>
                                    <td className="p-6 text-right font-black text-green-600">{formatPrice(sale.commission_amount)}</td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
      </main>

      {/* MODAL UNIVERSAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                        {modalType === 'reply' ? `Mensaje de: ${editingItem.sender_name}` : `Editando ${editingItem.title || 'Nuevo'}`}
                    </h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">×</button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-8">
                    {modalType === 'reply' && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mensaje Recibido</span>
                                <p className="font-black text-slate-800 text-lg mb-4">{editingItem.subject}</p>
                                <p className="text-slate-600 leading-relaxed font-medium bg-white p-6 rounded-2xl shadow-inner italic">{editingItem.body}</p>
                            </div>
                            
                            <form onSubmit={handleSave} className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Enviar Respuesta / Nuevo Mensaje</label>
                                <textarea 
                                    value={replyBody} 
                                    onChange={e=>setReplyBody(e.target.value)}
                                    placeholder="Escribe aquí para el destinatario..."
                                    className="w-full bg-slate-50 p-6 rounded-[2rem] font-bold outline-none border-2 border-transparent focus:border-green-500 transition-all h-32"
                                    required
                                />
                                <div className="flex justify-end gap-3">
                                     <button type="submit" className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-green-700 transition-all">Enviar Mensaje</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {modalType === 'inventory' && (
                        <form onSubmit={handleSave} className="space-y-8">
                            {/* CALCULADORA DE PROVEEDOR PARA AUTOS */}
                            {editingItem.type === 'car' && (
                                <div className="bg-lime-50 p-6 rounded-[2.5rem] border-2 border-lime-200">
                                    <h4 className="text-xs font-black text-green-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        🚀 Calculadora de Importación (Proveedor)
                                    </h4>
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[9px] font-bold text-green-700 uppercase ml-2">Precio Mensual Proveedor (BRL)</label>
                                            <input 
                                                type="number" 
                                                className="w-full bg-white p-3 rounded-xl font-bold border-2 border-lime-100 outline-none focus:border-green-500" 
                                                placeholder="Ej: 3000 Reais"
                                                value={monthlyBrlProvider}
                                                onChange={e=>setMonthlyBrlProvider(Number(e.target.value))}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={applyProviderConversion}
                                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-md"
                                        >
                                            Calcular Costo Diario
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-green-600 mt-2 italic">* Se calcula: (Monto / 30 días) * $260 ARS. El resultado se guarda como costo diario base en USD.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                                    <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500 transition-all" required />
                                </div>
                                {editingItem.type === 'car' && (
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marca</label>
                                        <input value={editingItem.brand} onChange={e=>setEditingItem({...editingItem, brand: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500 transition-all" required />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destino / Localidad</label>
                                    <input value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Costo Diario Base (USD)</label>
                                    <input type="number" step="0.01" value={editingItem.providerPrice || editingItem.providerPricePerDay || 0} onChange={e=>setEditingItem({...editingItem, providerPrice: Number(e.target.value), providerPricePerDay: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Margen de Ganancia Diario (USD)</label>
                                    <input type="number" value={editingItem.profitMargin || editingItem.profitMarginPerDay || 0} onChange={e=>setEditingItem({...editingItem, profitMargin: Number(e.target.value), profitMarginPerDay: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 focus:border-green-500" required />
                                </div>
                            </div>

                            {/* GESTIÓN DE IMÁGENES */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Galería de Fotos</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Pegar URL de imagen aquí..." 
                                        className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-slate-100 focus:border-lime-500"
                                        value={newImageUrl}
                                        onChange={e => setNewImageUrl(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addImageToEditingItem}
                                        className="bg-lime-500 text-green-950 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-lime-400 transition-all"
                                    >
                                        Añadir
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                                    {editingItem.images?.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                                            <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                                            <button 
                                                type="button"
                                                onClick={() => removeImageFromEditingItem(idx)}
                                                className="absolute top-1 right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {(!editingItem.images || editingItem.images.length === 0) && (
                                        <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase">
                                            No hay imágenes cargadas
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 border-t pt-8">
                                <button type="submit" className="bg-green-600 text-white px-12 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-green-700 transition-all">Guardar Producto</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
