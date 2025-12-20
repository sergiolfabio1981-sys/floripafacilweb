
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trip, Apartment, Excursion, HeroSlide, PromoBanner, CarRental, InstallmentTrip, Seller, Provider, Sale, UserRole, DestinationGuide } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getInstallmentTrips, saveInstallmentTrip, deleteInstallmentTrip, createEmptyInstallmentTrip } from '../services/installmentService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner, deleteHeroSlide } from '../services/heroService';
import { getTermsAndConditions, saveTermsAndConditions } from '../services/settingsService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';

const Admin: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [user, setUser] = useState<Seller | null>(() => {
      const saved = localStorage.getItem('floripa_user');
      return saved ? JSON.parse(saved) : null;
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<string>('metrics');
  const [isSaving, setIsSaving] = useState(false);

  // Lists
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [guides, setGuides] = useState<DestinationGuide[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'seller' | 'provider' | 'inventory_item' | 'guide' | null>(null);

  useEffect(() => {
    if (user) {
        loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
      if (activeTab === 'sellers' || activeTab === 'metrics') {
          const { data } = await supabase.from('sellers').select('*');
          setSellers(data || []);
      }
      if (activeTab === 'providers') {
          const { data } = await supabase.from('providers').select('*');
          setProviders(data || []);
      }
      if (activeTab === 'sales' || activeTab === 'metrics') {
          let query = supabase.from('sales').select('*').order('date', { ascending: false });
          if (user?.role === 'seller') {
              query = query.eq('seller_id', user.id);
          }
          const { data } = await query;
          setSales(data || []);
      }
      if (activeTab === 'inventory') {
          const trips = await getTrips();
          const cars = await getCarRentals();
          setInventory([...trips, ...cars]);
      }
      if (activeTab === 'guides') {
          const data = await getGuides();
          setGuides(data);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser: any = { id: 'admin-1', name: 'Administrador', role: 'admin', commissionRate: 0 };
      setUser(adminUser);
      localStorage.setItem('floripa_user', JSON.stringify(adminUser));
      return;
    }

    const { data, error } = await supabase.from('sellers').select('*').eq('email', email).single();
    if (data && !error) {
        setUser({...data, role: 'seller'});
        localStorage.setItem('floripa_user', JSON.stringify({...data, role: 'seller'}));
    } else {
      alert("Credenciales inválidas");
    }
  };
  
  const handleLogout = () => { setUser(null); localStorage.removeItem('floripa_user'); };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (modalType === 'seller') await supabase.from('sellers').upsert(editingItem);
          if (modalType === 'provider') await supabase.from('providers').upsert(editingItem);
          if (modalType === 'inventory_item') {
              if (editingItem.type === 'trip') await saveTrip(editingItem);
              if (editingItem.type === 'car') await saveCarRental(editingItem);
          }
          if (modalType === 'guide') await saveGuide(editingItem);
          
          await loadData();
          setIsModalOpen(false);
      } catch (err) {
          alert("Error al guardar");
      } finally { setIsSaving(false); }
  };

  if (!user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6 border-t-[12px] border-green-600">
                <div className="text-center">
                    <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" alt="Logo" className="h-28 mx-auto mb-4 rounded-full shadow-lg" />
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Gestión Interna</h2>
                </div>
                <div className="space-y-4">
                  <input type="email" placeholder="Email de usuario" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-medium" required />
                </div>
                <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 shadow-xl shadow-green-500/20 tracking-widest">INGRESAR</button>
            </form>
        </div>
     );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-8 border-b border-white/10 flex flex-col items-center">
              <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" className="h-20 w-20 rounded-full mb-3 shadow-xl" />
              <h3 className="font-black text-sm uppercase tracking-tighter">{user.name}</h3>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{user.role}</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <button onClick={()=>setActiveTab('metrics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='metrics' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>📊 Rendimiento</button>
              <button onClick={()=>setActiveTab('sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='sales' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>💰 Historial Ventas</button>
              <Link to="/planner" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 text-gray-400">✏️ Cotizador</button>
              {isAdmin && (
                <>
                  <button onClick={()=>setActiveTab('guides')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='guides' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🌍 Guías de Destino</button>
                  <button onClick={()=>setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='sellers' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>👥 Vendedores</button>
                  <button onClick={()=>setActiveTab('providers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='providers' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🚚 Proveedores</button>
                  <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🏨 Inventario (Precios)</button>
                </>
              )}
          </nav>
          <div className="p-4"><button onClick={handleLogout} className="w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Salir</button></div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
          {activeTab === 'guides' && isAdmin && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Guías de Destino</h1>
                  <button onClick={()=>{setModalType('guide'); setEditingItem(createEmptyGuide()); setIsModalOpen(true)}} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg">+ Crear Guía</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {guides.map(g => (
                   <div key={g.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                      <img src={g.images[0]} className="w-full h-40 object-cover rounded-2xl mb-4" />
                      <h3 className="font-black text-lg text-gray-800 mb-2">{g.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mb-4">{g.summary}</p>
                      <div className="mt-auto flex justify-between items-center">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${g.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {g.active ? 'Activa' : 'Inactiva'}
                        </span>
                        <button onClick={()=>{setModalType('guide'); setEditingItem(g); setIsModalOpen(true)}} className="text-xs font-bold text-blue-600 underline">Editar</button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-8">
               <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Panel de Rendimiento</h1>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Volumen de Ventas</p>
                      <p className="text-4xl font-black text-green-600">{formatPrice(sales.reduce((acc,s)=>acc+s.total_amount, 0))}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Margen Agencia</p>
                      <p className="text-4xl font-black text-indigo-600">{formatPrice(sales.reduce((acc,s)=>acc+(s as any).total_profit, 0))}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">{isAdmin ? 'Comisiones a Pagar' : 'Mis Comisiones (40%)'}</p>
                      <p className="text-4xl font-black text-blue-600">{formatPrice(sales.reduce((acc,s)=>acc+s.commission_amount, 0))}</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && isAdmin && (
            <div className="space-y-6">
                <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Gestión de Precios e Inventario</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-[10px] font-black uppercase text-gray-400">
                                <th className="p-6">Servicio</th>
                                <th className="p-6">Costo Proveedor</th>
                                <th className="p-6">Ganancia Agencia</th>
                                <th className="p-6">Precio Público</th>
                                <th className="p-6">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    <td className="p-6 font-bold">{item.title}</td>
                                    <td className="p-6 text-red-500 font-medium">{formatPrice(item.providerPrice || item.providerPricePerDay || 0)}</td>
                                    <td className="p-6 text-green-600 font-bold">{formatPrice(item.profitMargin || item.profitMarginPerDay || 0)}</td>
                                    <td className="p-6 font-black bg-slate-50">{formatPrice((item.providerPrice || item.providerPricePerDay || 0) + (item.profitMargin || item.profitMarginPerDay || 0))}</td>
                                    <td className="p-6"><button onClick={()=>{setModalType('inventory_item'); setEditingItem(item); setIsModalOpen(true)}} className="text-blue-600 font-bold underline">Editar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-6">
                <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Historial de Ventas</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-[10px] font-black uppercase text-gray-400">
                                <th className="p-6">Fecha</th>
                                <th className="p-6">Cliente</th>
                                <th className="p-6">Venta Total</th>
                                <th className="p-6">Comisión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td className="p-6">{new Date(sale.date).toLocaleDateString()}</td>
                                    <td className="p-6 font-bold">{sale.client_name}</td>
                                    <td className="p-6 font-black">{formatPrice(sale.total_amount)}</td>
                                    <td className="p-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">{formatPrice(sale.commission_amount)}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
      </main>

      {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl my-10 overflow-hidden">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                      <h3 className="font-black text-xl uppercase tracking-tighter">Gestión de {modalType === 'guide' ? 'Guía de Destino' : 'Elemento'}</h3>
                      <button onClick={()=>setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-800">&times;</button>
                  </div>
                  <form onSubmit={handleSave} className="p-8 space-y-6">
                      {modalType === 'guide' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Nombre del Destino</label><input value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required /></div>
                            <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Resumen (Card)</label><textarea value={editingItem.summary} onChange={e=>setEditingItem({...editingItem, summary: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 h-24" required /></div>
                            <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Descripción Larga (Detalles)</label><textarea value={editingItem.description} onChange={e=>setEditingItem({...editingItem, description: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 h-48" required /></div>
                          </div>
                          <div className="space-y-4">
                            <div><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Video URL (YouTube/Vimeo)</label><input value={editingItem.videoUrl} onChange={e=>setEditingItem({...editingItem, videoUrl: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" /></div>
                            <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Fotos (Una URL por línea)</label>
                              <textarea 
                                value={editingItem.images.join('\n')} 
                                onChange={e=>setEditingItem({...editingItem, images: e.target.value.split('\n').filter(l=>l.trim()!=='')})} 
                                className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 h-32" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Highlights / Imperdibles (Uno por línea)</label>
                              <textarea 
                                value={editingItem.highlights.join('\n')} 
                                onChange={e=>setEditingItem({...editingItem, highlights: e.target.value.split('\n').filter(l=>l.trim()!=='')})} 
                                className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 h-24" 
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <input type="checkbox" id="active" checked={editingItem.active} onChange={e=>setEditingItem({...editingItem, active: e.target.checked})} className="w-6 h-6 accent-green-600" />
                              <label htmlFor="active" className="text-xs font-bold text-gray-600 uppercase">Guía Visible al Público</label>
                            </div>
                          </div>
                        </div>
                      )}

                      {modalType === 'inventory_item' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Costo Proveedor</label>
                                <input type="number" value={editingItem.providerPrice || editingItem.providerPricePerDay || 0} onChange={e=>{
                                  const val = Number(e.target.value);
                                  if(editingItem.type === 'car') setEditingItem({...editingItem, providerPricePerDay: val});
                                  else setEditingItem({...editingItem, providerPrice: val});
                                }} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Margen Agencia</label>
                                <input type="number" value={editingItem.profitMargin || editingItem.profitMarginPerDay || 0} onChange={e=>{
                                  const val = Number(e.target.value);
                                  if(editingItem.type === 'car') setEditingItem({...editingItem, profitMarginPerDay: val});
                                  else setEditingItem({...editingItem, profitMargin: val});
                                }} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" required />
                            </div>
                        </div>
                      )}

                      <div className="pt-6 flex gap-3">
                          <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-bold uppercase text-xs">Cancelar</button>
                          <button type="submit" disabled={isSaving} className="flex-1 py-4 rounded-2xl bg-green-600 text-white font-black uppercase text-xs shadow-lg disabled:opacity-50">
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
