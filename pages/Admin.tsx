
import React, { useState, useEffect } from 'react';
import { Trip, CarRental, Excursion, Seller, Sale, DestinationGuide, Destination, Hotel, Apartment } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getHotels, saveHotel, deleteHotel, createEmptyHotel } from '../services/hotelService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getGuides, saveGuide, deleteGuide, createEmptyGuide } from '../services/guideService';
import { getDestinations, saveDestination, deleteDestination, createEmptyDestination } from '../services/destinationService';
import { supabase } from '../services/supabase';
import { useCurrency } from '../contexts/CurrencyContext';

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
  const [isSaving, setIsSaving] = useState(false);

  // Estados de datos
  const [inventory, setInventory] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'inventory_item' | 'guide' | 'destination' | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user, activeTab]);

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
      } catch (e) {
          console.error("Error al cargar datos:", e);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "sergiolfabio1981@gmail.com" && password === "Colo1981") {
      const adminUser: any = { id: 'admin-1', name: 'Director ABRAS', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('abras_user', JSON.stringify(adminUser));
      return;
    }
    alert("Acceso denegado.");
  };
  
  const handleLogout = () => { setUser(null); localStorage.removeItem('abras_user'); };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (modalType === 'destination') {
              await saveDestination(editingItem);
          } else if (modalType === 'inventory_item') {
              // Lógica de guardado específica por tipo
              const type = editingItem.type;
              if (type === 'trip') await saveTrip(editingItem);
              else if (type === 'car') await saveCarRental(editingItem);
              else if (type === 'excursion') await saveExcursion(editingItem);
              else if (type === 'hotel') await saveHotel(editingItem);
              else if (type === 'rental') await saveRental(editingItem);
          }
          
          await loadData();
          setIsModalOpen(false);
          alert("Cambios guardados correctamente.");
      } catch (err) {
          console.error(err);
          alert("Error al procesar la solicitud. Revisa la consola.");
      } finally { setIsSaving(false); }
  };

  const handleDelete = async (item: any) => {
      if (!window.confirm(`¿Estás seguro de eliminar "${item.title || item.name}"?`)) return;
      try {
          if (item.type === 'trip') await deleteTrip(item.id);
          else if (item.type === 'car') await deleteCarRental(item.id);
          else if (item.type === 'excursion') await deleteExcursion(item.id);
          else if (item.type === 'hotel') await deleteHotel(item.id);
          else if (item.type === 'rental') await deleteRental(item.id);
          else if (activeTab === 'destinations') await deleteDestination(item.id);
          
          await loadData();
          alert("Eliminado correctamente.");
      } catch (e) {
          console.error(e);
          alert("Error al eliminar.");
      }
  };

  // Lógica de separación de inventario por las categorías pedidas por el usuario
  const getFilteredInventory = () => {
      switch(inventoryCategory) {
          case 'tours': 
              return inventory.filter(i => i.type === 'trip' || (i.type === 'excursion' && !i.title.toLowerCase().includes('transfer') && !i.title.toLowerCase().includes('traslado')));
          case 'transfers':
              return inventory.filter(i => i.type === 'excursion' && (i.title.toLowerCase().includes('transfer') || i.title.toLowerCase().includes('traslado') || i.specialLabel?.includes('TRASLADO')));
          case 'cars':
              return inventory.filter(i => i.type === 'car');
          case 'lodging':
              return inventory.filter(i => i.type === 'hotel' || i.type === 'rental');
          default: return inventory;
      }
  };

  if (!user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" className="h-24 mx-auto mb-6 rounded-full shadow-md" />
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Acceso Admin ABRAS</h2>
                </div>
                <div className="space-y-3">
                  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-medium" required />
                  <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-medium" required />
                </div>
                <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest text-sm">Entrar al Sistema</button>
            </form>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 flex flex-col">
          <div className="p-8 border-b border-white/10 text-center">
              <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" className="w-20 h-20 mx-auto rounded-full mb-4 border-2 border-green-500" />
              <h3 className="font-black text-xs uppercase tracking-widest text-green-400">Admin Panel</h3>
          </div>
          <nav className="flex-1 p-4 space-y-2">
              <button onClick={()=>setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='inventory' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>🎒 Inventario</button>
              <button onClick={()=>setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab==='destinations' ? 'bg-green-600' : 'hover:bg-white/5 text-gray-400'}`}>📍 Destinos</button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 mt-10 transition-all italic">Cerrar Sesión</button>
          </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {activeTab === 'inventory' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Gestión de Publicaciones</h1>
                        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
                            {[
                                {id: 'tours', label: 'Excursiones y Tours'},
                                {id: 'transfers', label: 'Transfers Aeropuerto'},
                                {id: 'cars', label: 'Alquiler de Coches'},
                                {id: 'lodging', label: 'Alojamientos (Hoteles/Casas)'}
                            ].map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={()=>setInventoryCategory(cat.id as any)} 
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${inventoryCategory === cat.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-green-500'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={()=>{
                            setModalType('inventory_item'); 
                            // Default depends on category
                            if(inventoryCategory==='cars') setEditingItem(createEmptyCarRental());
                            else if(inventoryCategory==='lodging') setEditingItem(createEmptyHotel());
                            else if(inventoryCategory==='transfers') setEditingItem({...createEmptyExcursion(), specialLabel: 'TRASLADO', title: 'Nuevo Transfer'});
                            else setEditingItem(createEmptyTrip());
                            setIsModalOpen(true);
                        }} 
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-green-700 transition-all shrink-0"
                    >
                        + Nuevo Anuncio
                    </button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 border-b border-slate-100">
                              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                  <th className="p-8">Servicio</th>
                                  <th className="p-8">Ubicación</th>
                                  <th className="p-8">Precio Público</th>
                                  <th className="p-8 text-right">Acciones</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {getFilteredInventory().map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images[0]} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                            <div>
                                                <p className="font-black text-slate-800 leading-tight">{item.title}</p>
                                                <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 rounded">{item.type}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 font-bold text-slate-500 uppercase text-xs">{item.location}</td>
                                    <td className="p-8">
                                        <span className="text-slate-900 font-black text-base bg-slate-100 px-3 py-1 rounded-lg">
                                            {formatPrice(
                                                (item.providerPrice || item.providerPricePerDay || item.providerPricePerNight || 0) + 
                                                (item.profitMargin || item.profitMarginPerDay || item.profitMarginPerNight || 0)
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={()=>{setModalType('inventory_item'); setEditingItem(item); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                            <button onClick={()=>handleDelete(item)} className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'destinations' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Polos Turísticos</h1>
                    <button onClick={()=>{setModalType('destination'); setEditingItem(createEmptyDestination()); setIsModalOpen(true)}} className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-black transition-all">+ Agregar Destino</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {destinations.map(d => (
                          <div key={d.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center group">
                              <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🇧🇷</div>
                              <span className="font-black text-slate-800 uppercase text-lg tracking-tighter">{d.name}</span>
                              <div className="mt-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={()=>{setModalType('destination'); setEditingItem(d); setIsModalOpen(true)}} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">Editar</button>
                                  <button onClick={()=>handleDelete(d)} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Eliminar</button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </main>

      {/* MODAL MAESTRO ACTUALIZADO */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl my-10 overflow-hidden animate-pop-in">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                      <div>
                          <h3 className="font-black text-2xl uppercase tracking-tighter text-slate-800">Editor de Servicio</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuración técnica para {editingItem.type || 'nuevo'}</p>
                      </div>
                      <button onClick={()=>setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm text-2xl text-gray-400 hover:text-red-500 transition-colors">&times;</button>
                  </div>
                  <form onSubmit={handleSave} className="p-10 space-y-8">
                      
                      {modalType === 'inventory_item' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Tipo de Publicación</label>
                                    <select 
                                        value={editingItem.type} 
                                        onChange={e=>setEditingItem({...editingItem, type: e.target.value})} 
                                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-green-500" 
                                        disabled={!!editingItem.created_at}
                                    >
                                        <option value="trip">Paquete / Tour</option>
                                        <option value="excursion">Traslado / Paseo Corto</option>
                                        <option value="car">Alquiler de Coche</option>
                                        <option value="hotel">Hotel / Posada</option>
                                        <option value="rental">Alquiler Temporario (Casa/Depto)</option>
                                    </select>
                                </div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Título Público</label><input value={editingItem.title} onChange={e=>setEditingItem({...editingItem, title: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 font-bold" required /></div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Asignar Destino</label>
                                    <select value={editingItem.location} onChange={e=>setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-green-500" required>
                                        <option value="">Seleccionar...</option>
                                        {destinations.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                                
                                {/* Campos dinámicos según tipo */}
                                {editingItem.type === 'hotel' && (
                                    <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Estrellas (1-5)</label><input type="number" min="1" max="5" value={editingItem.stars || 3} onChange={e=>setEditingItem({...editingItem, stars: Number(e.target.value)})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" /></div>
                                )}
                                {editingItem.type === 'rental' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Habitaciones</label><input type="number" value={editingItem.bedrooms || 1} onChange={e=>setEditingItem({...editingItem, bedrooms: Number(e.target.value)})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" /></div>
                                        <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Huéspedes Máx.</label><input type="number" value={editingItem.maxGuests || 2} onChange={e=>setEditingItem({...editingItem, maxGuests: Number(e.target.value)})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none" /></div>
                                    </div>
                                )}
                                
                                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Descripción</label><textarea value={editingItem.description} onChange={e=>setEditingItem({...editingItem, description: e.target.value})} className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-green-500 h-32 font-medium" required /></div>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-red-400 mb-2 block italic">Costo Prov (USD)</label>
                                        <input type="number" step="0.01" value={editingItem.providerPrice || editingItem.providerPricePerDay || editingItem.providerPricePerNight || 0} onChange={e=>{
                                            const v = Number(e.target.value);
                                            if(editingItem.type==='car') setEditingItem({...editingItem, providerPricePerDay: v});
                                            else if(editingItem.type==='hotel' || editingItem.type==='rental') setEditingItem({...editingItem, providerPricePerNight: v});
                                            else setEditingItem({...editingItem, providerPrice: v});
                                        }} className="w-full bg-red-50 border-2 border-red-100 p-4 rounded-2xl font-black text-red-600 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-green-400 mb-2 block italic">Margen ABRAS (USD)</label>
                                        <input type="number" step="0.01" value={editingItem.profitMargin || editingItem.profitMarginPerDay || editingItem.profitMarginPerNight || 0} onChange={e=>{
                                            const v = Number(e.target.value);
                                            if(editingItem.type==='car') setEditingItem({...editingItem, profitMarginPerDay: v});
                                            else if(editingItem.type==='hotel' || editingItem.type==='rental') setEditingItem({...editingItem, profitMarginPerNight: v});
                                            else setEditingItem({...editingItem, profitMargin: v});
                                        }} className="w-full bg-green-50 border-2 border-green-100 p-4 rounded-2xl font-black text-green-600 outline-none" required />
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-6 rounded-[2rem] text-center shadow-inner">
                                    <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-2">Precio Final Público</p>
                                    <p className="text-4xl font-black text-white tracking-tighter">
                                        {formatPrice(
                                            (editingItem.providerPrice || editingItem.providerPricePerDay || editingItem.providerPricePerNight || 0) + 
                                            (editingItem.profitMargin || editingItem.profitMarginPerDay || editingItem.profitMarginPerNight || 0)
                                        )}
                                    </p>
                                </div>
                                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">URLs de Imágenes (Una por línea)</label><textarea value={editingItem.images?.join('\n')} onChange={e=>setEditingItem({...editingItem, images: e.target.value.split('\n').filter(l=>l.trim()!=='')})} className="w-full border-2 border-slate-100 p-4 rounded-2xl h-32 text-[10px] font-mono" placeholder="https://..." /></div>
                                <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-2xl">
                                    <input type="checkbox" checked={editingItem.isOffer} onChange={e=>setEditingItem({...editingItem, isOffer: e.target.checked})} className="w-5 h-5 rounded border-orange-300 text-orange-600" />
                                    <label className="text-[10px] font-black uppercase text-orange-700">Marcar como Oferta Destacada</label>
                                </div>
                            </div>
                        </div>
                      )}

                      {modalType === 'destination' && (
                        <div className="space-y-4">
                            <div><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Nombre del Destino</label><input value={editingItem.name} onChange={e=>setEditingItem({...editingItem, name: e.target.value})} className="w-full border-2 border-slate-100 p-6 rounded-2xl outline-none focus:border-green-500 font-black text-2xl uppercase tracking-tighter" required /></div>
                        </div>
                      )}

                      <div className="pt-8 flex gap-4 border-t border-slate-100">
                          <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-black uppercase text-xs text-gray-400 hover:bg-slate-50 transition-all">Cancelar</button>
                          <button type="submit" disabled={isSaving} className="flex-1 py-5 rounded-2xl bg-green-600 text-white font-black uppercase text-xs shadow-2xl hover:bg-green-700 transition-all disabled:opacity-50">
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
