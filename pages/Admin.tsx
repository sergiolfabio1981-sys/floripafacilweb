
import React, { useState, useEffect } from 'react';
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getHotels, saveHotel, deleteHotel, createEmptyHotel } from '../services/hotelService';
import { getCarRentals, saveCarRental, deleteCarRental, createEmptyCarRental } from '../services/carRentalService';
import { getInstallmentTrips, saveInstallmentTrip, deleteInstallmentTrip, createEmptyInstallmentTrip } from '../services/installmentService';
import { getWorldCupTrips, saveWorldCupTrip, deleteWorldCupTrip, createEmptyWorldCupTrip } from '../services/worldCupService';
import { getGroupTrips, saveGroupTrip, deleteGroupTrip, createEmptyGroupTrip } from '../services/groupService';
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
  const [activeTab, setActiveTab] = useState<'hero' | 'trips' | 'rentals' | 'excursions' | 'hotels' | 'cars' | 'installments' | 'worldcup' | 'groups' | 'legales' | 'quote'>('trips');
  const [isSaving, setIsSaving] = useState(false);
  const [listSearchTerm, setListSearchTerm] = useState('');

  // State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [rentals, setRentals] = useState<Apartment[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [installments, setInstallments] = useState<InstallmentTrip[]>([]);
  const [worldCupTrips, setWorldCupTrips] = useState<WorldCupTrip[]>([]);
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [termsText, setTermsText] = useState('');

  // Edit State
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingRental, setEditingRental] = useState<Apartment | null>(null);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingCar, setEditingCar] = useState<CarRental | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentTrip | null>(null);
  const [editingWorldCup, setEditingWorldCup] = useState<WorldCupTrip | null>(null);
  const [editingGroup, setEditingGroup] = useState<GroupTrip | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  const [tripDatesInput, setTripDatesInput] = useState('');
  const [rentalAmenitiesInput, setRentalAmenitiesInput] = useState('');
  const [excursionDatesInput, setExcursionDatesInput] = useState('');
  const [hotelAmenitiesInput, setHotelAmenitiesInput] = useState('');
  const [groupDatesInput, setGroupDatesInput] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        loadAllData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
      setListSearchTerm('');
      if (activeTab === 'legales') {
          getTermsAndConditions().then(setTermsText);
      }
  }, [activeTab]);

  const loadAllData = async () => {
      try {
          const [t, r, e, h, c, i, w, g, hs, pb] = await Promise.all([
              getTrips(), getRentals(), getExcursions(), getHotels(), getCarRentals(),
              getInstallmentTrips(), getWorldCupTrips(), getGroupTrips(),
              getHeroSlides(), getPromoBanners()
          ]);
          setTrips(t); setRentals(r); setExcursions(e); setHotels(h); setCars(c);
          setInstallments(i); setWorldCupTrips(w); setGroupTrips(g);
          setHeroSlides(hs); setPromoBanners(pb);
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
      setEditingHotel(null); setEditingCar(null); setEditingInstallment(null); setEditingWorldCup(null);
      setEditingGroup(null); setEditingSlide(null); setEditingBanner(null);
      setIsSaving(false);
  };

  const handleDelete = async (id: any, type: string) => {
      if(!window.confirm("¿Eliminar este elemento?")) return;
      try {
          if (type === 'trip') await deleteTrip(id);
          if (type === 'rental') await deleteRental(id);
          if (type === 'hotel') await deleteHotel(id);
          if (type === 'car') await deleteCarRental(id);
          if (type === 'excursion') await deleteExcursion(id);
          if (type === 'group') await deleteGroupTrip(id);
          if (type === 'installment') await deleteInstallmentTrip(id);
          if (type === 'worldcup') await deleteWorldCupTrip(id);
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
          else if (editingHotel) await saveHotel({...editingHotel, amenities: hotelAmenitiesInput.split('\n').filter(a=>a.trim()!=='')});
          else if (editingCar) await saveCarRental(editingCar);
          else if (editingExcursion) await saveExcursion({...editingExcursion, availableDates: excursionDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingGroup) await saveGroupTrip({...editingGroup, availableDates: groupDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingInstallment) await saveInstallmentTrip(editingInstallment);
          else if (editingWorldCup) await saveWorldCupTrip(editingWorldCup);
          else if (editingSlide) await saveHeroSlide(editingSlide);
          else if (editingBanner) await savePromoBanner(editingBanner);
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
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tighter">ACCESO DUEÑO</h2>
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tighter">Panel Floripa Fácil</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {['hero','trips','groups','hotels','cars','rentals','excursions','installments','worldcup','legales', 'quote'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-md whitespace-nowrap capitalize text-xs font-bold transition-all ${activeTab === tab ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
                            {tab === 'hero' ? 'Portada' : tab === 'quote' ? 'Cotizador' : tab === 'cars' ? 'Coches' : tab}
                        </button>
                    ))}
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100">Cerrar Sesión</button>
            </div>
        </div>

        {activeTab === 'cars' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                    <h2 className="font-bold text-xl text-green-800">Alquiler de Coches</h2>
                    <button onClick={()=>{resetEditState(); setEditingCar(createEmptyCarRental()); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Coche</button>
                </div>
                <div className="space-y-1">
                    {cars.map(c => (
                        <div key={c.id} className="flex justify-between border-b py-3 items-center group">
                            <div>
                                <span className="font-medium">{c.brand} {c.title}</span>
                                <span className="text-xs text-gray-400 ml-2">({c.category} - {c.location})</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>{resetEditState(); setEditingCar({...c}); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button>
                                <button onClick={()=>handleDelete(c.id, 'car')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Existing Tab rendering logic for others... */}

        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold">Información del Coche</h3>
                        <button onClick={()=>setIsModalOpen(false)} className="text-2xl text-gray-400">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {editingCar && (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={editingCar.brand} onChange={e=>setEditingCar({...editingCar, brand: e.target.value})} placeholder="Marca (ej: Chevrolet)" className="w-full border p-2 rounded" required />
                                        <input value={editingCar.title} onChange={e=>setEditingCar({...editingCar, title: e.target.value})} placeholder="Modelo (ej: Onix o Similar)" className="w-full border p-2 rounded" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select value={editingCar.category} onChange={e=>setEditingCar({...editingCar, category: e.target.value})} className="w-full border p-2 rounded">
                                            <option>Económico</option><option>Intermedio</option><option>SUV</option><option>Premium</option><option>Pick-up</option>
                                        </select>
                                        <input value={editingCar.location} onChange={e=>setEditingCar({...editingCar, location: e.target.value})} placeholder="Ubicación de entrega" className="w-full border p-2 rounded" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <span className="absolute left-2 top-2 text-gray-400 text-xs">$</span>
                                            <input type="number" value={editingCar.pricePerDay} onChange={e=>setEditingCar({...editingCar, pricePerDay: Number(e.target.value)})} placeholder="Precio x Día" className="w-full border p-2 pl-6 rounded" required />
                                        </div>
                                        <select value={editingCar.baseCurrency} onChange={e=>setEditingCar({...editingCar, baseCurrency: e.target.value as any})} className="border p-2 rounded">
                                            <option value="USD">USD (Dólares)</option>
                                            <option value="BRL">BRL (Reales)</option>
                                            <option value="ARS">ARS (Pesos)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select value={editingCar.transmission} onChange={e=>setEditingCar({...editingCar, transmission: e.target.value as any})} className="border p-2 rounded">
                                            <option>Manual</option><option>Automático</option>
                                        </select>
                                        <select value={editingCar.fuel} onChange={e=>setEditingCar({...editingCar, fuel: e.target.value as any})} className="border p-2 rounded">
                                            <option>Nafta</option><option>Diesel</option><option>Híbrido</option><option>Eléctrico</option>
                                        </select>
                                    </div>
                                    <textarea value={editingCar.description} onChange={e=>setEditingCar({...editingCar, description: e.target.value})} placeholder="Requisitos (Licencia, Franquicia, Edad min...)" className="w-full border p-2 rounded h-32" />
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" value={editingCar.doors} onChange={e=>setEditingCar({...editingCar, doors: Number(e.target.value)})} placeholder="Puertas" className="border p-2 rounded" />
                                        <input type="number" value={editingCar.passengers} onChange={e=>setEditingCar({...editingCar, passengers: Number(e.target.value)})} placeholder="Pasajeros" className="border p-2 rounded" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" value={editingCar.largeSuitcases} onChange={e=>setEditingCar({...editingCar, largeSuitcases: Number(e.target.value)})} placeholder="Valijas Grandes" className="border p-2 rounded" />
                                        <input type="number" value={editingCar.smallSuitcases} onChange={e=>setEditingCar({...editingCar, smallSuitcases: Number(e.target.value)})} placeholder="Valijas Chicas" className="border p-2 rounded" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <label className="flex items-center gap-2 font-bold text-sm"><input type="checkbox" checked={editingCar.hasAC} onChange={e=>setEditingCar({...editingCar, hasAC: e.target.checked})} /> Aire Acond.</label>
                                        <label className="flex items-center gap-2 font-bold text-sm text-green-600"><input type="checkbox" checked={editingCar.isOffer} onChange={e=>setEditingCar({...editingCar, isOffer: e.target.checked})} /> Destacar Oferta</label>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Fotos del Vehículo (PNG/JPG)</label>
                                        <input type="file" multiple onChange={e=>handleFileUpload(e, setEditingCar)} className="text-xs w-full" />
                                        <div className="flex gap-2 mt-2 flex-wrap max-h-24 overflow-y-auto">{editingCar.images.map((img, i)=><img key={i} src={img} className="w-12 h-12 object-cover rounded border" />)}</div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Descuento (%)</label>
                                        <input type="number" value={editingCar.discount || 0} onChange={e=>setEditingCar({...editingCar, discount: Number(e.target.value)})} className="w-full border p-2 rounded" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 border rounded font-bold text-gray-500">Cancelar</button>
                                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg">{isSaving ? 'Guardando...' : 'Guardar Coche'}</button>
                                </div>
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
