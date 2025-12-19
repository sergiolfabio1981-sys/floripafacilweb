
import React, { useState, useEffect } from 'react';
import { Trip, Apartment, Excursion, HeroSlide, PromoBanner, CarRental, InstallmentTrip } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getInstallmentTrips, saveInstallmentTrip, deleteInstallmentTrip, createEmptyInstallmentTrip } from '../services/installmentService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner, deleteHeroSlide } from '../services/heroService';
import { getTermsAndConditions, saveTermsAndConditions } from '../services/settingsService';
import { ADMIN_EMAIL, ADMIN_PASS } from '../constants';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return localStorage.getItem('floripa_isAdmin') === 'true';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'trips' | 'rentals' | 'excursions' | 'cars' | 'installments' | 'legales' | 'quote'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [rentals, setRentals] = useState<Apartment[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [installments, setInstallments] = useState<InstallmentTrip[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [termsText, setTermsText] = useState('');

  // Edit State
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingRental, setEditingRental] = useState<Apartment | null>(null);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);
  const [editingCar, setEditingCar] = useState<CarRental | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentTrip | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  const [tripDatesInput, setTripDatesInput] = useState('');
  const [rentalAmenitiesInput, setRentalAmenitiesInput] = useState('');
  const [excursionDatesInput, setExcursionDatesInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
      if (activeTab === 'legales') {
          getTermsAndConditions().then(setTermsText);
      }
  }, [activeTab]);

  const loadAllData = async () => {
      try {
          const [t, r, e, c, i, hs, pb] = await Promise.all([
              getTrips(), getRentals(), getExcursions(), getCarRentals(),
              getInstallmentTrips(), getHeroSlides(), getPromoBanners()
          ]);
          setTrips(t); setRentals(r); setExcursions(e); setCars(c);
          setInstallments(i); setHeroSlides(hs); setPromoBanners(pb);
      } catch (error) {
          console.error("Error loading data", error);
      }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      localStorage.setItem('floripa_isAdmin', 'true');
    } else {
      alert('Credenciales inválidas');
    }
  };
  
  const handleLogout = () => { setIsAuthenticated(false); localStorage.removeItem('floripa_isAdmin'); };

  const resetEditState = () => {
      setEditingTrip(null); setEditingRental(null); setEditingExcursion(null);
      setEditingCar(null); setEditingInstallment(null);
      setEditingSlide(null); setEditingBanner(null);
      setIsSaving(false);
  };

  const handleDelete = async (id: any, type: string) => {
      if(!window.confirm("¿Eliminar este elemento?")) return;
      try {
          if (type === 'trip') await deleteTrip(id);
          if (type === 'rental') await deleteRental(id);
          if (type === 'car') await deleteCarRental(id);
          if (type === 'excursion') await deleteExcursion(id);
          if (type === 'installment') await deleteInstallmentTrip(id);
          if (type === 'hero_slide') await deleteHeroSlide(id);
          await loadAllData();
      } catch (e) {
          alert('Error al eliminar');
      }
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (editingTrip) await saveTrip({...editingTrip, availableDates: tripDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingRental) await saveRental({...editingRental, amenities: rentalAmenitiesInput.split('\n').filter(a=>a.trim()!=='')});
          else if (editingCar) await saveCarRental(editingCar);
          else if (editingExcursion) await saveExcursion({...editingExcursion, availableDates: excursionDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingInstallment) await saveInstallmentTrip(editingInstallment);
          else if (editingSlide) await saveHeroSlide(editingSlide);
          else if (editingBanner) await savePromoBanner(editingBanner);
          else if (activeTab === 'legales') await saveTermsAndConditions(termsText);
          await loadAllData();
          setIsModalOpen(false);
      } catch (error) {
          alert("Error al guardar.");
      } finally { setIsSaving(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      const result = await new Promise<string>((resolve) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file as Blob);
      });
      newImages.push(result);
    }
    setter((prev: any) => prev ? { ...prev, images: [...(prev.images || []), ...newImages] } : null);
    e.target.value = '';
  };

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border-t-8 border-green-600">
                <div className="text-center">
                    <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" alt="Logo" className="h-24 mx-auto mb-4 rounded-full shadow-lg" />
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tighter">ABRAS TRAVEL ADMIN</h2>
                </div>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400"> {showPassword ? '🙈' : '👁️'} </button>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">Entrar al Panel</button>
            </form>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
                <img src="https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png" alt="Logo" className="h-16 rounded-full shadow-md" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tighter">Panel de Gestión</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {[
                        {id: 'hero', label: 'Portada'},
                        {id: 'trips', label: 'Tours'},
                        {id: 'cars', label: 'Coches'},
                        {id: 'rentals', label: 'Alquileres'},
                        {id: 'excursions', label: 'Excursiones'},
                        {id: 'installments', label: 'Cuotas'},
                        {id: 'legales', label: 'Legales'},
                        {id: 'quote', label: 'Cotizador'}
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-md whitespace-nowrap text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100">Salir</button>
            </div>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        
        {activeTab === 'hero' && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between mb-4">
                        <h2 className="font-bold text-xl text-green-800">Slides Principales</h2>
                        <button onClick={()=>{resetEditState(); setEditingSlide({id: Date.now(), image: '', title: '', subtitle: '', ctaText: 'Ver más', ctaLink: '/', highlightColor: 'text-white'}); setIsModalOpen(true)}} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xs">+ Nuevo Slide</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {heroSlides.map(s => (
                            <div key={s.id} className="border rounded-xl overflow-hidden group relative">
                                <img src={s.image} className="h-32 w-full object-cover" />
                                <div className="p-3">
                                    <p className="font-bold text-sm truncate">{s.title}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={()=>{resetEditState(); setEditingSlide({...s}); setIsModalOpen(true)}} className="text-blue-600 text-xs font-bold underline">Editar</button>
                                        <button onClick={()=>handleDelete(s.id, 'hero_slide')} className="text-red-600 text-xs font-bold underline">Borrar</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'trips' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">Paquetes y Tours</h2>
                    <button onClick={()=>{resetEditState(); setEditingTrip(createEmptyTrip()); setTripDatesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Tour</button>
                </div>
                <div className="space-y-1">
                    {trips.map(t => (
                        <div key={t.id} className="flex justify-between border-b py-3 items-center">
                            <div className="flex items-center gap-3">
                                <img src={t.images[0]} className="w-10 h-10 rounded object-cover" />
                                <div><span className="font-medium">{t.title}</span><span className="text-xs text-gray-400 ml-2">{t.location}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingTrip({...t}); setTripDatesInput(t.availableDates.join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-xs">Editar</button>
                                <button onClick={()=>handleDelete(t.id, 'trip')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'cars' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">Alquiler de Coches</h2>
                    <button onClick={()=>{resetEditState(); setEditingCar(createEmptyCarRental()); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Coche</button>
                </div>
                <div className="space-y-1">
                    {cars.map(c => (
                        <div key={c.id} className="flex justify-between border-b py-3 items-center">
                            <div className="flex items-center gap-3">
                                <img src={c.images[0]} className="w-10 h-10 rounded object-cover" />
                                <div><span className="font-medium">{c.brand} {c.title}</span><span className="text-xs text-gray-400 ml-2">({c.category})</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingCar({...c}); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-xs">Editar</button>
                                <button onClick={()=>handleDelete(c.id, 'car')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'rentals' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">Alojamientos / Casas</h2>
                    <button onClick={()=>{resetEditState(); setEditingRental(createEmptyRental()); setRentalAmenitiesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nueva Propiedad</button>
                </div>
                <div className="space-y-1">
                    {rentals.map(r => (
                        <div key={r.id} className="flex justify-between border-b py-3 items-center">
                            <div className="flex items-center gap-3">
                                <img src={r.images[0]} className="w-10 h-10 rounded object-cover" />
                                <div><span className="font-medium">{r.title}</span><span className="text-xs text-gray-400 ml-2">{r.location}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingRental({...r}); setRentalAmenitiesInput(r.amenities.join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-xs">Editar</button>
                                <button onClick={()=>handleDelete(r.id, 'rental')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'excursions' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">Excursiones y Traslados</h2>
                    <button onClick={()=>{resetEditState(); setEditingExcursion(createEmptyExcursion()); setExcursionDatesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Servicio</button>
                </div>
                <div className="space-y-1">
                    {excursions.map(e => (
                        <div key={e.id} className="flex justify-between border-b py-3 items-center">
                            <div className="flex items-center gap-3">
                                <img src={e.images[0]} className="w-10 h-10 rounded object-cover" />
                                <div><span className="font-medium">{e.title}</span><span className="text-xs text-gray-400 ml-2">{e.location}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingExcursion({...e}); setExcursionDatesInput(e.availableDates.join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-xs">Editar</button>
                                <button onClick={()=>handleDelete(e.id, 'excursion')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'installments' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">ABRAS Cuotas</h2>
                    <button onClick={()=>{resetEditState(); setEditingInstallment(createEmptyInstallmentTrip()); setIsModalOpen(true)}} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Plan</button>
                </div>
                <div className="space-y-1">
                    {installments.map(i => (
                        <div key={i.id} className="flex justify-between border-b py-3 items-center">
                            <div className="flex items-center gap-3">
                                <img src={i.images[0]} className="w-10 h-10 rounded object-cover" />
                                <div><span className="font-medium">{i.title}</span><span className="text-xs text-gray-400 ml-2">Salida: {i.departureDate}</span></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingInstallment({...i}); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-xs">Editar</button>
                                <button onClick={()=>handleDelete(i.id, 'installment')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-xs">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'legales' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-xl text-green-800 mb-4">Bases y Condiciones</h2>
                <textarea 
                    value={termsText} 
                    onChange={e=>setTermsText(e.target.value)} 
                    className="w-full h-96 border p-4 rounded-xl font-mono text-sm"
                    placeholder="Escribe aquí los términos legales..."
                />
                <div className="mt-4 flex justify-end">
                    <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Guardar Cambios</button>
                </div>
            </div>
        )}

        {/* MODAL PARA EDICIÓN */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold">Formulario de Gestión</h3>
                        <button onClick={()=>setIsModalOpen(false)} className="text-2xl text-gray-400">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {editingTrip && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input value={editingTrip.title} onChange={e=>setEditingTrip({...editingTrip, title: e.target.value})} placeholder="Título del Tour" className="w-full border p-2 rounded" required />
                                    <input value={editingTrip.location} onChange={e=>setEditingTrip({...editingTrip, location: e.target.value})} placeholder="Ubicación" className="w-full border p-2 rounded" required />
                                    <input value={editingTrip.price} onChange={e=>setEditingTrip({...editingTrip, price: Number(e.target.value)})} type="number" placeholder="Precio Base" className="w-full border p-2 rounded" required />
                                    <select value={editingTrip.baseCurrency} onChange={e=>setEditingTrip({...editingTrip, baseCurrency: e.target.value as any})} className="w-full border p-2 rounded">
                                        <option value="USD">Dólares (USD)</option>
                                        <option value="ARS">Pesos (ARS)</option>
                                    </select>
                                    <textarea value={editingTrip.description} onChange={e=>setEditingTrip({...editingTrip, description: e.target.value})} placeholder="Descripción del viaje..." className="w-full border p-2 rounded h-32" />
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-400">Fechas de Salida (una por línea)</label>
                                    <textarea value={tripDatesInput} onChange={e=>setTripDatesInput(e.target.value)} placeholder="Ej: Lunes 15 de Enero" className="w-full border p-2 rounded h-32" />
                                    <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingTrip)} className="text-xs" />
                                    <div className="flex gap-2 flex-wrap">{editingTrip.images.map((img,i)=><img key={i} src={img} className="w-12 h-12 object-cover rounded" />)}</div>
                                    <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={editingTrip.isOffer} onChange={e=>setEditingTrip({...editingTrip, isOffer: e.target.checked})} /> Destacar como Oferta</label>
                                </div>
                                <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition-colors">Guardar Tour</button>
                            </form>
                        )}

                        {editingCar && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input value={editingCar.brand} onChange={e=>setEditingCar({...editingCar, brand: e.target.value})} placeholder="Marca" className="w-full border p-2 rounded" required />
                                    <input value={editingCar.title} onChange={e=>setEditingCar({...editingCar, title: e.target.value})} placeholder="Modelo" className="w-full border p-2 rounded" required />
                                    <select value={editingCar.category} onChange={e=>setEditingCar({...editingCar, category: e.target.value})} className="w-full border p-2 rounded">
                                        <option>Económico</option><option>Intermedio</option><option>SUV</option><option>Premium</option>
                                    </select>
                                    <input value={editingCar.pricePerDay} onChange={e=>setEditingCar({...editingCar, pricePerDay: Number(e.target.value)})} type="number" placeholder="Precio x día" className="w-full border p-2 rounded" required />
                                </div>
                                <div className="space-y-4">
                                    <textarea value={editingCar.description} onChange={e=>setEditingCar({...editingCar, description: e.target.value})} placeholder="Descripción..." className="w-full border p-2 rounded h-32" />
                                    <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingCar)} className="text-xs" />
                                    <div className="flex gap-2 flex-wrap">{editingCar.images.map((img,i)=><img key={i} src={img} className="w-12 h-12 object-cover rounded" />)}</div>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 border rounded">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded font-bold">Guardar Coche</button>
                                </div>
                            </form>
                        )}

                        {editingRental && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input value={editingRental.title} onChange={e=>setEditingRental({...editingRental, title: e.target.value})} placeholder="Título" className="w-full border p-2 rounded" required />
                                    <input value={editingRental.location} onChange={e=>setEditingRental({...editingRental, location: e.target.value})} placeholder="Ubicación" className="w-full border p-2 rounded" required />
                                    <input value={editingRental.pricePerNight} onChange={e=>setEditingRental({...editingRental, pricePerNight: Number(e.target.value)})} type="number" placeholder="Precio x Noche" className="w-full border p-2 rounded" required />
                                </div>
                                <div className="space-y-4">
                                    <textarea value={rentalAmenitiesInput} onChange={e=>setRentalAmenitiesInput(e.target.value)} placeholder="Amenidades (una por línea)" className="w-full border p-2 rounded h-32" />
                                    <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingRental)} />
                                </div>
                                <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded font-bold">Guardar Propiedad</button>
                            </form>
                        )}

                        {editingExcursion && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input value={editingExcursion.title} onChange={e=>setEditingExcursion({...editingExcursion, title: e.target.value})} placeholder="Título" className="w-full border p-2 rounded" required />
                                    <input value={editingExcursion.price} onChange={e=>setEditingExcursion({...editingExcursion, price: Number(e.target.value)})} type="number" placeholder="Precio" className="w-full border p-2 rounded" required />
                                    <input value={editingExcursion.duration} onChange={e=>setEditingExcursion({...editingExcursion, duration: e.target.value})} placeholder="Duración" className="w-full border p-2 rounded" />
                                </div>
                                <div className="space-y-4">
                                    <textarea value={excursionDatesInput} onChange={e=>setExcursionDatesInput(e.target.value)} placeholder="Fechas (una por línea)" className="w-full border p-2 rounded h-32" />
                                    <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingExcursion)} />
                                </div>
                                <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded font-bold">Guardar Servicio</button>
                            </form>
                        )}

                        {editingInstallment && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <input value={editingInstallment.title} onChange={e=>setEditingInstallment({...editingInstallment, title: e.target.value})} placeholder="Título del Plan" className="w-full border p-2 rounded" required />
                                    <input value={editingInstallment.totalPrice} onChange={e=>setEditingInstallment({...editingInstallment, totalPrice: Number(e.target.value)})} type="number" placeholder="Precio Total" className="w-full border p-2 rounded" required />
                                    <input value={editingInstallment.departureDate} onChange={e=>setEditingInstallment({...editingInstallment, departureDate: e.target.value})} type="date" className="w-full border p-2 rounded" required />
                                </div>
                                <div className="space-y-4">
                                    <textarea value={editingInstallment.description} onChange={e=>setEditingInstallment({...editingInstallment, description: e.target.value})} placeholder="Descripción..." className="w-full border p-2 rounded h-32" />
                                    <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingInstallment)} />
                                </div>
                                <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-3 rounded font-bold">Guardar ABRAS Cuotas</button>
                            </form>
                        )}

                        {editingSlide && (
                            <form onSubmit={handleSave} className="space-y-4">
                                <input value={editingSlide.title} onChange={e=>setEditingSlide({...editingSlide, title: e.target.value})} placeholder="Título Grande" className="w-full border p-2 rounded font-bold" required />
                                <input value={editingSlide.subtitle} onChange={e=>setEditingSlide({...editingSlide, subtitle: e.target.value})} placeholder="Subtítulo descriptivo" className="w-full border p-2 rounded" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input value={editingSlide.ctaText} onChange={e=>setEditingSlide({...editingSlide, ctaText: e.target.value})} placeholder="Texto Botón" className="border p-2 rounded" />
                                    <input value={editingSlide.ctaLink} onChange={e=>setEditingSlide({...editingSlide, ctaLink: e.target.value})} placeholder="Link Botón" className="border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400">Imagen de Portada (URL o Base64)</label>
                                    <input type="file" onChange={e=>handleFileUpload(e, setEditingSlide)} className="block mt-1" />
                                </div>
                                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Guardar Slide</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
