
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, AppMessage, HeroSlide, PromoBanner } from '../types';
import { getTrips, saveTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, createEmptyExcursion } from '../services/excursionService';
import { getGuides, saveGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, createEmptyDestination } from '../services/destinationService';
import { getSellers, saveSeller, createEmptySeller } from '../services/sellerService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner } from '../services/heroService';
import { getMessages } from '../services/messageService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';
import { LOGO_URL } from '../constants';

const Admin: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [user, setUser] = useState<any>(() => {
      const saved = localStorage.getItem('ff_user');
      return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [inventoryCategory, setInventoryCategory] = useState<'tours' | 'transfers' | 'cars'>('tours');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbStatus, setDbStatus] = useState<{[key: string]: 'online' | 'error'}>({});

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

  const loadTabData = async () => {
      setIsLoading(true);
      try {
          switch (activeTab) {
              case 'inventory':
                  const [t, c, e] = await Promise.all([getTrips(), getCarRentals(), getExcursions()]);
                  setInventory([...t.map(i=>({...i, type:'trip'})), ...c.map(i=>({...i, type:'car'})), ...e.map(i=>({...i, type:'excursion'}))]);
                  break;
              case 'home':
                  setHeroSlides(await getHeroSlides());
                  setPromoBanners(await getPromoBanners());
                  break;
              case 'destinations': setDestinations(await getDestinations()); break;
              case 'guides': setGuides(await getGuides()); break;
              case 'sales': 
                  const { data } = await supabase.from('sales').select('*').order('date', { ascending: false });
                  setSales(data || []);
                  break;
              case 'sellers': setSellers(await getSellers()); break;
              case 'messages': setMessages(await getMessages()); break;
          }
          setDbStatus(prev => ({...prev, [activeTab]: 'online'}));
      } catch (err) {
          setDbStatus(prev => ({...prev, [activeTab]: 'error'}));
      } finally { setIsLoading(false); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const pass = (e.currentTarget.elements.namedItem('pass') as HTMLInputElement).value;
    if (email === "sergiolfabio1981@gmail.com" && pass === "Colo1981") {
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
          } 
          else if (modalType === 'hero') await saveHeroSlide(editingItem);
          else if (modalType === 'banner') await savePromoBanner(editingItem);
          else if (modalType === 'destination') await saveDestination(editingItem);
          else if (modalType === 'guide') await saveGuide(editingItem);
          else if (modalType === 'seller') await saveSeller(editingItem);

          await loadTabData();
          setIsModalOpen(false);
          alert("Cambios guardados correctamente.");
      } catch (err: any) {
          alert(`Error: ${err.message}. Asegúrate de haber ejecutado el SQL de las tablas en Supabase.`);
      } finally { setIsSaving(false); }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#042F24] p-4 font-sans">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop')] bg-cover opacity-10"></div>
            <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up">
                <div className="text-center mb-10">
                    <img src={LOGO_URL} className="h-20 mx-auto mb-6 rounded-2xl p-1 bg-white border border-slate-100" alt="Logo" />
                    <h2 className="text-4xl font-black text-[#064E3B] tracking-tightest italic uppercase leading-none">Admin<br/>System</h2>
                </div>
                <div className="space-y-4">
                  <input name="email" type="email" placeholder="Email" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:border-[#22c55e] transition-all outline-none" required />
                  <input name="pass" type="password" placeholder="Pass" className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-bold focus:border-[#22c55e] transition-all outline-none" required />
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-[#064E3B] transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl mt-4">Iniciar Sesión</button>
                </div>
            </form>
        </div>
    );
  }

  const SidebarBtn = ({id, label, icon}: any) => (
    <button 
        onClick={()=>setActiveTab(id)} 
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${activeTab===id ? 'sidebar-link-active text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{icon}</span> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-80 bg-slate-950 text-white flex flex-col h-screen md:sticky md:top-0 shrink-0 shadow-2xl z-20">
          <div className="p-10 border-b border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <img src={LOGO_URL} className="w-12 h-12 rounded-xl bg-white p-1" alt="Logo" />
                <div>
                    <h3 className="font-black text-sm uppercase tracking-tighter italic leading-none">Floripa Fácil</h3>
                    <span className="text-[8px] font-black text-lime-400 uppercase tracking-widest">Digital Console</span>
                </div>
              </div>
          </div>
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
              <SidebarBtn id="home" label="Gestión Home" icon="🏠" />
              <SidebarBtn id="inventory" label="Servicios" icon="🎒" />
              <SidebarBtn id="destinations" label="Destinos" icon="📍" />
              <SidebarBtn id="guides" label="Guías Viaje" icon="📖" />
              <SidebarBtn id="sales" label="Ventas" icon="💰" />
              <SidebarBtn id="messages" label="Mensajes" icon="✉️" />
              
              <div className="pt-6 mt-6 border-t border-white/5">
                <button onClick={()=>{localStorage.removeItem('ff_user'); window.location.reload();}} className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black text-red-400 hover:bg-red-500/10 rounded-2xl uppercase tracking-[0.2em] transition-all italic">🚪 Salir</button>
              </div>
          </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <header className="flex justify-between items-center mb-12 animate-slide-in">
              <div>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] block mb-2">Administración</span>
                  <h1 className="text-5xl font-black text-slate-800 tracking-tightest uppercase italic leading-none">{activeTab}</h1>
              </div>
              <div className="flex gap-4">
                  {['home', 'inventory', 'destinations', 'guides'].includes(activeTab) && (
                      <button onClick={()=>{
                          if(activeTab === 'home') openEdit('hero', {id: Date.now(), title:'', subtitle:'', image:'', ctaText:'Ver más', ctaLink:'/'});
                          else if(activeTab === 'inventory') openEdit('inventory', createEmptyTrip());
                          else if(activeTab === 'destinations') openEdit('destination', createEmptyDestination());
                          else if(activeTab === 'guides') openEdit('guide', createEmptyGuide());
                      }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">+ Nuevo</button>
                  )}
                  <button onClick={loadTabData} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">🔄</button>
              </div>
          </header>

          {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <div className="w-12 h-12 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cargando Datos...</p>
              </div>
          ) : (
            <div className="animate-slide-up">
                {activeTab === 'home' && (
                    <div className="space-y-16">
                        <section>
                            <h2 className="text-xl font-black text-slate-800 uppercase italic mb-8 tracking-widest border-l-4 border-green-600 pl-4">Slides Principales (Hero)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {heroSlides.map(slide => (
                                    <div key={slide.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 bento-card">
                                        <div className="h-48 relative">
                                            <img src={slide.image} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                                                <h4 className="text-white font-black text-lg uppercase italic">{slide.title}</h4>
                                            </div>
                                        </div>
                                        <div className="p-6 flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-400">ID: {slide.id}</span>
                                            <button onClick={()=>openEdit('hero', slide)} className="bg-slate-50 text-slate-600 font-black px-4 py-2 rounded-xl text-[9px] uppercase hover:bg-green-600 hover:text-white transition-all">Editar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-black text-slate-800 uppercase italic mb-8 tracking-widest border-l-4 border-green-600 pl-4">Promo Banners</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {promoBanners.map(banner => (
                                    <div key={banner.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 shadow-sm">
                                        <img src={banner.image} className="w-20 h-20 rounded-2xl object-cover shadow-inner" />
                                        <div className="flex-1">
                                            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">{banner.badge}</span>
                                            <h4 className="font-black text-slate-800 uppercase italic">{banner.title}</h4>
                                        </div>
                                        <button onClick={()=>openEdit('banner', banner)} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100">✏️</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="space-y-8">
                        <div className="flex gap-2 p-1.5 bg-slate-200/50 w-fit rounded-2xl border border-slate-200">
                            {['tours', 'transfers', 'cars'].map(c => (
                                <button key={c} onClick={()=>setInventoryCategory(c as any)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${inventoryCategory===c ? 'bg-white text-[#064E3B] shadow-sm ring-1 ring-slate-300' : 'text-slate-500'}`}>{c}</button>
                            ))}
                        </div>
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b">
                                    <tr><th className="px-8 py-6">Servicio</th><th className="px-8 py-6">Precio (Base)</th><th className="px-8 py-6 text-right">Acciones</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {inventory.filter(i => inventoryCategory==='tours'?i.type==='trip':inventoryCategory==='transfers'?i.type==='excursion':i.type==='car').map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={item.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm uppercase italic">{item.title}</p>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-green-700 tracking-tighter text-lg">{formatPrice((item.providerPrice || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerDay || 0), 'USD')}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={()=>openEdit('inventory', item)} className="p-3 bg-slate-50 text-slate-400 hover:text-green-600 rounded-xl transition-all">✏️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'destinations' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destinations.map(d => (
                            <div key={d.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between group shadow-sm bento-card">
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 uppercase italic mb-2">{d.name}</h4>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${d.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{d.active ? 'VISIBLE' : 'OCULTO'}</span>
                                </div>
                                <button onClick={()=>openEdit('destination', d)} className="mt-6 w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Editar</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}
      </main>

      {/* MODAL GLOBAL PREMIUM */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                    <div>
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1 block">Property Editor</span>
                        <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{modalType}: {editingItem.title || editingItem.name}</h3>
                    </div>
                    <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-red-50 text-xl transition-all">×</button>
                </div>
                
                <div className="p-10 overflow-y-auto space-y-8 scrollbar-hide">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* CAMPOS DE TEXTO - Incluimos 'image' para que aparezca la URL en Slides/Banners */}
                             {Object.keys(editingItem).filter(k => ['title', 'name', 'location', 'subtitle', 'ctaText', 'ctaLink', 'badge', 'link', 'image'].includes(k)).map(key => (
                                 <div key={key} className="space-y-2">
                                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{key}</label>
                                     <input className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-green-500 transition-all outline-none text-sm" value={editingItem[key] || ''} onChange={e=>setEditingItem({...editingItem, [key]: e.target.value})} />
                                 </div>
                             ))}
                        </div>

                        {/* VISTA PREVIA PARA IMAGEN ÚNICA (Slides / Banners) */}
                        {editingItem.image !== undefined && (
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Vista Previa Imagen</label>
                                <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-lg bg-slate-50">
                                    {editingItem.image ? (
                                        <img src={editingItem.image} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-xs">Sin imagen</div>
                                    )}
                                </div>
                                <p className="text-[9px] text-slate-400 italic">Pega arriba en el campo 'image' la URL de la nueva fotografía (Unsplash, ImgBB, etc).</p>
                            </div>
                        )}

                        {/* GALERÍA PARA MÚLTIPLES IMÁGENES (Tours / Autos) */}
                        {editingItem.images !== undefined && (
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Galería de Imágenes</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {(editingItem.images || []).map((img: string, idx: number) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm border-2 border-slate-100">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button type="button" onClick={()=>{ const copy=[...editingItem.images]; copy.splice(idx,1); setEditingItem({...editingItem, images:copy}); }} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg text-[8px] font-black uppercase">Borrar</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={()=>{ const url=prompt("URL de imagen:"); if(url) setEditingItem({...editingItem, images:[...(editingItem.images||[]), url]}); }} className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                        <span className="text-2xl">+</span>
                                        <span className="text-[8px] font-black uppercase">Añadir a Galería</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 border-t pt-8 mt-4">
                            <button type="button" onClick={()=>setIsModalOpen(false)} className="px-8 py-4 font-black text-slate-400 uppercase text-[9px]">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-xl font-black uppercase text-[9px] shadow-lg hover:shadow-green-200 transition-all">
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
