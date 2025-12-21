
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
  const { formatPrice, convertPrice } = useCurrency();
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

  // Estados para la calculadora de precios en el modal
  const [inputHelper, setInputHelper] = useState({
      brlCost: 0,
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
      if (!window.confirm("¿Deseas CARGAR LA FLOTA DE MOVIDA y los datos iniciales? Se actualizarán Tours, Traslados y Autos.")) return;
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
          alert("¡FLOTA MOVIDA Y DATOS SINCRONIZADOS!");
          loadData();
      } catch (err: any) {
          alert("Error al sincronizar datos: " + err.message);
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
          const type = editingItem.type; 
          const cleanItem = scrubItem(editingItem);
          if (modalType === 'inventory') {
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
      
      // Inicializar ayuda de precios basada en el item actual
      const currentPrice = item.providerPrice || item.providerPricePerDay || 0;
      const currentMargin = item.profitMargin || item.profitMarginPerDay || 0;
      
      // Cálculo inverso: USD to BRL para el asistente
      const brlEquivalent = (currentPrice * 1220) / 260;

      setInputHelper({
          brlCost: Number(brlEquivalent.toFixed(2)),
          usdCost: currentPrice,
          targetMarginUsd: currentMargin
      });

      setIsModalOpen(true);
      setNewImageUrl('');
  };

  // Función mágica de conversión para el asistente
  const updatePriceFromBrl = (brl: number) => {
      const arsValue = brl * 260; // Tasa solicitada
      const usdValue = arsValue / 1220; // Tasa mercado sistema
      
      setInputHelper(prev => ({ ...prev, brlCost: brl, usdCost: Number(usdValue.toFixed(2)) }));
      
      if (editingItem.type === 'car') {
          setEditingItem({ ...editingItem, providerPricePerDay: Number(usdValue.toFixed(2)) });
      } else {
          setEditingItem({ ...editingItem, providerPrice: Number(usdValue.toFixed(2)) });
      }
  };

  const updateMargin = (usdMargin: number) => {
      setInputHelper(prev => ({ ...prev, targetMarginUsd: usdMargin }));
      if (editingItem.type === 'car') {
          setEditingItem({ ...editingItem, profitMarginPerDay: usdMargin });
      } else {
          setEditingItem({ ...editingItem, profitMargin: usdMargin });
      }
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

  const filteredMessages = messages.filter(m => messageFilter === 'all' || m.type === messageFilter);
  const unreadCount = messages.filter(m => !m.is_read).length;

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
                <button onClick={handleSyncDefaults} disabled={isSaving} className="w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-400/10 rounded-2xl">⚙️ Sincronizar Flota Movida</button>
                <button onClick={()=>{localStorage.removeItem('abras_user'); window.location.reload();}} className="w-full text-left px-6 py-4 text-[10px] font-black text-red-400 hover:bg-red-400/10 rounded-2xl uppercase tracking-widest mt-2">🚪 Cerrar Sesión</button>
              </div>
          </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Inventario Floripa Fácil</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                            {['tours', 'transfers', 'cars'].map(cat => (
                                <button key={cat} onClick={()=>setInventoryCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${inventoryCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="p-6">Producto</th>
                                  <th className="p-6 text-right">Precio Actual (ARS)</th>
                                  <th className="p-6 text-right">Acciones</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {inventory.filter(i => inventoryCategory === 'tours' ? i.type === 'trip' : inventoryCategory === 'transfers' ? i.type === 'excursion' : i.type === 'car').map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images?.[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-tight">{item.brand ? `${item.brand} ${item.title}` : item.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right font-black text-green-700">
                                        {formatPrice((item.providerPrice || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerDay || 0), 'USD')}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={()=>openEdit('inventory', item)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-all shadow-sm">✏️</button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-pop-in">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center shrink-0">
                    <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Carga de Precios y Datos</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold">×</button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-8">
                    {modalType === 'inventory' && (
                        <form onSubmit={handleSave} className="space-y-8">
                            
                            {/* ASISTENTE DE CARGA MULTIMONEDA */}
                            <div className="bg-gradient-to-br from-green-50 to-lime-50 p-8 rounded-[3rem] border-2 border-green-200 shadow-inner">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">💰</span>
                                    <h4 className="text-sm font-black text-green-800 uppercase tracking-widest">Asistente de Carga (Conversión Automática)</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-green-700 uppercase ml-2">1. Costo Proveedor (BRL Reales)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                className="w-full bg-white p-4 rounded-2xl font-bold border-2 border-green-100 focus:border-green-500 outline-none transition-all" 
                                                value={inputHelper.brlCost} 
                                                onChange={e => updatePriceFromBrl(Number(e.target.value))}
                                                placeholder="Ej: 100"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-green-300">R$</span>
                                        </div>
                                        <p className="text-[9px] text-green-600/70 font-bold px-2 italic">Convertido a $260 ARS x Real</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-700 uppercase ml-2">2. Margen de Ganancia (USD Dólar)</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                className="w-full bg-white p-4 rounded-2xl font-bold border-2 border-blue-100 focus:border-blue-500 outline-none transition-all" 
                                                value={inputHelper.targetMarginUsd} 
                                                onChange={e => updateMargin(Number(e.target.value))}
                                                placeholder="Ej: 15"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-blue-300">USD</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/60 p-6 rounded-[2rem] border border-green-100 flex flex-col justify-center">
                                        <span className="text-[9px] font-black text-gray-400 uppercase mb-2 block">El cliente verá en la web:</span>
                                        <div className="text-2xl font-black text-green-700 tracking-tighter">
                                            {formatPrice(inputHelper.usdCost + inputHelper.targetMarginUsd, 'USD')}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 mt-1">
                                            (Base: {Number(inputHelper.usdCost + inputHelper.targetMarginUsd).toFixed(2)} USD)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Título del Servicio</label>
                                    <input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-green-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Localidad</label>
                                    <input value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-2 border-transparent focus:border-green-500 transition-all" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b pb-2">Gestión de Imágenes</h4>
                                <div className="flex gap-4">
                                    <input value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold" placeholder="Pegar URL de la imagen..." />
                                    <button type="button" onClick={addImageToEditingItem} className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase">Añadir</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {editingItem.images?.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video shadow-md">
                                            <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                                            <button type="button" onClick={()=>removeImageFromEditingItem(idx)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center font-black uppercase text-[10px]">Eliminar</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 border-t pt-8">
                                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-10 py-4 font-black text-slate-400 uppercase text-[10px]">Cancelar</button>
                                <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-green-700 disabled:opacity-50">
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
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
