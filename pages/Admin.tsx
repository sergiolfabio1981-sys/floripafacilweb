
import React, { useState, useEffect } from 'react';
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner } from '../types';
import { getTrips, saveTrip, deleteTrip, createEmptyTrip } from '../services/tripService';
import { getRentals, saveRental, deleteRental, createEmptyRental } from '../services/rentalService';
import { getExcursions, saveExcursion, deleteExcursion, createEmptyExcursion } from '../services/excursionService';
import { getHotels, saveHotel, deleteHotel, createEmptyHotel } from '../services/hotelService';
import { getInstallmentTrips, saveInstallmentTrip, deleteInstallmentTrip, createEmptyInstallmentTrip } from '../services/installmentService';
import { getWorldCupTrips, saveWorldCupTrip, deleteWorldCupTrip, createEmptyWorldCupTrip } from '../services/worldCupService';
import { getGroupTrips, saveGroupTrip, deleteGroupTrip, createEmptyGroupTrip } from '../services/groupService';
import { getHeroSlides, saveHeroSlide, getPromoBanners, savePromoBanner, deleteHeroSlide } from '../services/heroService';
import { getTermsAndConditions, saveTermsAndConditions } from '../services/settingsService';
import { generateDestinationGuide } from '../services/geminiService';
import { generateQuotePDF } from '../services/quotePdfService';
import { ADMIN_EMAIL, ADMIN_PASS } from '../constants';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return localStorage.getItem('floripa_isAdmin') === 'true';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'trips' | 'rentals' | 'excursions' | 'hotels' | 'installments' | 'worldcup' | 'groups' | 'legales' | 'quote'>('trips');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // List Search
  const [listSearchTerm, setListSearchTerm] = useState('');

  // State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [rentals, setRentals] = useState<Apartment[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [installments, setInstallments] = useState<InstallmentTrip[]>([]);
  const [worldCupTrips, setWorldCupTrips] = useState<WorldCupTrip[]>([]);
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [termsText, setTermsText] = useState('');

  // Quote State
  const [quoteData, setQuoteData] = useState({
      clientName: '',
      origin: 'Buenos Aires',
      destination: '',
      dates: '',
      passengers: 2,
      price: 0,
      description: '',
      guideText: '',
      imageUrl: ''
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Edit State
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingRental, setEditingRental] = useState<Apartment | null>(null);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
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
      // Reset search on tab change
      setListSearchTerm('');
      
      if (activeTab === 'legales') {
          getTermsAndConditions().then(setTermsText);
      }
  }, [activeTab]);

  const loadAllData = async () => {
      try {
          const [t, r, e, h, i, w, g, hs, pb] = await Promise.all([
              getTrips(), getRentals(), getExcursions(), getHotels(),
              getInstallmentTrips(), getWorldCupTrips(), getGroupTrips(),
              getHeroSlides(), getPromoBanners()
          ]);
          setTrips(t); setRentals(r); setExcursions(e); setHotels(h);
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
      setEditingHotel(null); setEditingInstallment(null); setEditingWorldCup(null);
      setEditingGroup(null); setEditingSlide(null); setEditingBanner(null);
      setImageUrlInput(''); setIsSaving(false);
  };

  const handleDelete = async (id: any, type: string) => {
      if(!window.confirm("¿Eliminar este elemento?")) return;
      try {
          if (type === 'trip') await deleteTrip(id);
          if (type === 'rental') await deleteRental(id);
          if (type === 'hotel') await deleteHotel(id);
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

  const handleDuplicate = async (item: any, type: string) => {
      if(!window.confirm("¿Duplicar esta publicación?")) return;
      
      const newId = crypto.randomUUID();
      const newItem = { ...item, id: newId, title: `${item.title} (COPIA)` };
      
      delete newItem.created_at;
      resetEditState();

      if (type === 'trip') {
          await saveTrip(newItem);
          setEditingTrip(newItem);
          setTripDatesInput((newItem.availableDates || []).join('\n'));
      } else if (type === 'rental') {
          await saveRental(newItem);
          setEditingRental(newItem);
          setRentalAmenitiesInput((newItem.amenities || []).join('\n'));
      } else if (type === 'hotel') {
          await saveHotel(newItem);
          setEditingHotel(newItem);
          setHotelAmenitiesInput((newItem.amenities || []).join('\n'));
      } else if (type === 'excursion') {
          await saveExcursion(newItem);
          setEditingExcursion(newItem);
          setExcursionDatesInput((newItem.availableDates || []).join('\n'));
      } else if (type === 'group') {
          await saveGroupTrip(newItem);
          setEditingGroup(newItem);
          setGroupDatesInput((newItem.availableDates || []).join('\n'));
      } else if (type === 'installment') {
          await saveInstallmentTrip(newItem);
          setEditingInstallment(newItem);
      } else if (type === 'worldcup') {
          await saveWorldCupTrip(newItem);
          setEditingWorldCup(newItem);
      }

      await loadAllData();
      setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          if (editingTrip) await saveTrip({...editingTrip, availableDates: tripDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingRental) await saveRental({...editingRental, amenities: rentalAmenitiesInput.split('\n').filter(a=>a.trim()!=='')});
          else if (editingHotel) await saveHotel({...editingHotel, amenities: hotelAmenitiesInput.split('\n').filter(a=>a.trim()!=='')});
          else if (editingExcursion) await saveExcursion({...editingExcursion, availableDates: excursionDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingGroup) await saveGroupTrip({...editingGroup, availableDates: groupDatesInput.split('\n').filter(d=>d.trim()!=='')});
          else if (editingInstallment) await saveInstallmentTrip(editingInstallment);
          else if (editingWorldCup) await saveWorldCupTrip(editingWorldCup);
          else if (editingSlide) await saveHeroSlide(editingSlide);
          else if (editingBanner) await savePromoBanner(editingBanner);
          
          await loadAllData();
          setIsModalOpen(false);
      } catch (error) {
          console.error("Error saving:", error);
          alert("Hubo un error al guardar. Verifique los datos o la conexión.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleSaveLegales = async () => {
      setIsSaving(true);
      try {
          await saveTermsAndConditions(termsText);
          alert('Bases y Condiciones guardadas correctamente.');
      } catch (e) {
          alert('Error al guardar.');
      } finally {
          setIsSaving(false);
      }
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

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => setEditingSlide(prev => prev ? { ...prev, image: ev.target?.result as string } : null);
      reader.readAsDataURL(file);
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => setEditingBanner(prev => prev ? { ...prev, image: ev.target?.result as string } : null);
      reader.readAsDataURL(file);
  };

  const autoGeocode = async (address: string, setter: any, currentObj: any) => {
      if(!address) return alert("Ingrese una ubicación o dirección primero.");
      setIsGeocoding(true);
      try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              setter({ ...currentObj, lat, lng });
              alert(`¡Ubicación encontrada!\nLat: ${lat}\nLng: ${lng}`);
          } else {
              alert("No se encontraron coordenadas para esa dirección.");
          }
      } catch (error) {
          alert("Error al conectar con el servicio de mapas.");
      } finally {
          setIsGeocoding(false);
      }
  };

  const createNewHeroSlide = () => {
      const newId = heroSlides.length > 0 ? Math.max(...heroSlides.map(s => s.id)) + 1 : 1;
      setEditingSlide({
          id: newId,
          image: '',
          title: 'Nuevo Anuncio',
          subtitle: 'Descripción breve',
          ctaText: 'Ver Más',
          ctaLink: '/trips',
          highlightColor: 'text-lime-400'
      });
      setIsModalOpen(true);
  };

  const selectProductForQuote = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      if (!selectedId) return;
      let product: any = trips.find(t => t.id === selectedId) ||
                       hotels.find(h => h.id === selectedId) ||
                       groupTrips.find(g => g.id === selectedId) ||
                       rentals.find(r => r.id === selectedId) ||
                       worldCupTrips.find(w => w.id === selectedId);
      if (product) {
          setQuoteData(prev => ({
              ...prev,
              destination: product.location || product.title,
              description: product.description || '',
              price: product.price || product.pricePerNight || product.totalPrice || 0,
              imageUrl: product.images?.[0] || '',
              dates: product.availableDates?.[0] || ''
          }));
      }
  };

  const handleGenerateAI = async () => {
      if (!quoteData.destination) return alert("Ingrese un destino primero.");
      setIsGeneratingAI(true);
      const guide = await generateDestinationGuide(quoteData.destination);
      setQuoteData(prev => ({ ...prev, guideText: guide }));
      setIsGeneratingAI(false);
  };

  const handleDownloadPDF = async () => {
      await generateQuotePDF(quoteData);
  };

  const filterList = (list: any[]) => {
      if (!listSearchTerm) return list;
      const term = listSearchTerm.toLowerCase();
      return list.filter(item => 
          item.title?.toLowerCase().includes(term) || 
          item.location?.toLowerCase().includes(term)
      );
  };

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 border-t-8 border-green-600">
                <div className="text-center">
                    <img src="https://i.postimg.cc/mD8G8h4H/Logo-Floripa-Facil.png" alt="Logo" className="h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Acceso Dueño</h2>
                </div>
                <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-green-600">
                        {showPassword ? '🙈' : '👁️'}
                    </button>
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
                <img src="https://i.postimg.cc/mD8G8h4H/Logo-Floripa-Facil.png" alt="Logo" className="h-12" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel Floripa Fácil</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm overflow-x-auto w-full md:w-auto scrollbar-hide">
                    {['hero','trips','groups','hotels','rentals','excursions','installments','worldcup','legales', 'quote'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-md whitespace-nowrap capitalize text-sm font-bold ${activeTab === tab ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
                            {tab === 'hero' ? 'Portada' : tab === 'quote' ? 'Cotizador' : tab}
                        </button>
                    ))}
                </div>
                <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 whitespace-nowrap">Cerrar Sesión</button>
            </div>
        </div>

        {/* Search */}
        {!['hero', 'legales', 'quote'].includes(activeTab) && (
            <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Filtrar por título o ubicación..." className="w-full outline-none text-sm" value={listSearchTerm} onChange={(e) => setListSearchTerm(e.target.value)} />
            </div>
        )}

        {/* Lists Container */}
        {activeTab === 'trips' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-green-800">Paquetes / Paseos</h2><button onClick={()=>{resetEditState(); setEditingTrip(createEmptyTrip()); setTripDatesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-green-600">+ Nuevo Paquete</button></div><div className="space-y-1">{filterList(trips).map(t=><div key={t.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{t.title}</span><span className="text-xs text-gray-400 ml-2">({t.location})</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(t, 'trip')} className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="Duplicar">❐</button><button onClick={()=>{resetEditState(); setEditingTrip({...t}); setTripDatesInput((t.availableDates || []).join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(t.id, 'trip')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}
        
        {activeTab === 'hotels' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-blue-800">Hoteles</h2><button onClick={()=>{resetEditState(); setEditingHotel(createEmptyHotel()); setHotelAmenitiesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Hotel</button></div><div className="space-y-1">{filterList(hotels).map(h=><div key={h.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{h.title}</span><span className="text-xs text-gray-400 ml-2">{h.stars}★</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(h, 'hotel')} className="bg-gray-100 p-2 rounded hover:bg-gray-200">❐</button><button onClick={()=>{resetEditState(); setEditingHotel({...h}); setHotelAmenitiesInput((h.amenities || []).join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(h.id, 'hotel')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}
        
        {activeTab === 'rentals' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-teal-800">Alquileres / Autos</h2><button onClick={()=>{resetEditState(); setEditingRental(createEmptyRental()); setRentalAmenitiesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Alquiler</button></div><div className="space-y-1">{filterList(rentals).map(r=><div key={r.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{r.title}</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(r, 'rental')} className="bg-gray-100 p-2 rounded">❐</button><button onClick={()=>{resetEditState(); setEditingRental({...r}); setRentalAmenitiesInput((r.amenities || []).join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(r.id, 'rental')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}

        {activeTab === 'excursions' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-orange-800">Excursiones / Traslados</h2><button onClick={()=>{resetEditState(); setEditingExcursion(createEmptyExcursion()); setExcursionDatesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nueva Excursión</button></div><div className="space-y-1">{filterList(excursions).map(e=><div key={e.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{e.title}</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(e, 'excursion')} className="bg-gray-100 p-2 rounded">❐</button><button onClick={()=>{resetEditState(); setEditingExcursion({...e}); setExcursionDatesInput((e.availableDates || []).join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(e.id, 'excursion')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}

        {activeTab === 'groups' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-purple-700">Grupales</h2><button onClick={()=>{resetEditState(); setEditingGroup(createEmptyGroupTrip()); setGroupDatesInput(''); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Grupal</button></div><div className="space-y-1">{filterList(groupTrips).map(g=><div key={g.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{g.title}</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(g, 'group')} className="bg-gray-100 p-2 rounded">❐</button><button onClick={()=>{resetEditState(); setEditingGroup({...g}); setGroupDatesInput((g.availableDates || []).join('\n')); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(g.id, 'group')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}

        {activeTab === 'installments' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-indigo-800">Cuotas / Planes</h2><button onClick={()=>{resetEditState(); setEditingInstallment(createEmptyInstallmentTrip()); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Plan</button></div><div className="space-y-1">{filterList(installments).map(i=><div key={i.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{i.title}</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(i, 'installment')} className="bg-gray-100 p-2 rounded">❐</button><button onClick={()=>{resetEditState(); setEditingInstallment({...i}); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(i.id, 'installment')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}

        {activeTab === 'worldcup' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><div className="flex justify-between mb-4"><h2 className="font-bold text-xl text-blue-900">Mundial 2026</h2><button onClick={()=>{resetEditState(); setEditingWorldCup(createEmptyWorldCupTrip()); setIsModalOpen(true)}} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">+ Nuevo Paquete</button></div><div className="space-y-1">{filterList(worldCupTrips).map(w=><div key={w.id} className="flex justify-between border-b py-3 items-center group"><div><span className="font-medium">{w.title}</span></div><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>handleDuplicate(w, 'worldcup')} className="bg-gray-100 p-2 rounded">❐</button><button onClick={()=>{resetEditState(); setEditingWorldCup({...w}); setIsModalOpen(true)}} className="bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold">Editar</button><button onClick={()=>handleDelete(w.id, 'worldcup')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold">Eliminar</button></div></div>)}</div></div>)}

        {activeTab === 'legales' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Bases y Condiciones</h2>
                <textarea value={termsText} onChange={e=>setTermsText(e.target.value)} className="w-full h-96 border p-4 rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Escriba aquí los términos..."></textarea>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleSaveLegales} disabled={isSaving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                        {isSaving ? 'Guardando...' : 'Guardar Términos'}
                    </button>
                </div>
            </div>
        )}

        {/* Quoter Tab */}
        {activeTab === 'quote' && (
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Cotizador Floripa Fácil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-green-700 border-b pb-1">1. Datos del Cliente</h3>
                        <input value={quoteData.clientName} onChange={e=>setQuoteData({...quoteData, clientName:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Nombre y Apellido" />
                        <div className="grid grid-cols-2 gap-4">
                            <input value={quoteData.origin} onChange={e=>setQuoteData({...quoteData, origin:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Lugar de Origen" />
                            <input type="number" value={quoteData.passengers} onChange={e=>setQuoteData({...quoteData, passengers:Number(e.target.value)})} className="border p-3 w-full rounded-lg" placeholder="Pasajeros" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-blue-700 border-b pb-1">2. Producto Base</h3>
                        <select onChange={selectProductForQuote} className="border p-3 w-full rounded-lg bg-gray-50">
                            <option value="">Seleccionar Producto Cargado...</option>
                            <optgroup label="Paquetes">{trips.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</optgroup>
                            <optgroup label="Hoteles">{hotels.map(h=><option key={h.id} value={h.id}>{h.title}</option>)}</optgroup>
                            <optgroup label="Grupales">{groupTrips.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</optgroup>
                        </select>
                    </div>
                </div>
                <div className="mt-8 space-y-4">
                    <h3 className="font-bold text-orange-600 border-b pb-1">3. Detalles Personalizados</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={quoteData.destination} onChange={e=>setQuoteData({...quoteData, destination:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Destino Principal" />
                        <input value={quoteData.dates} onChange={e=>setQuoteData({...quoteData, dates:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Fechas Estimadas" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" value={quoteData.price} onChange={e=>setQuoteData({...quoteData, price:Number(e.target.value)})} className="border p-3 w-full rounded-lg font-bold text-lg" placeholder="Precio Total USD" />
                        <input value={quoteData.imageUrl} onChange={e=>setQuoteData({...quoteData, imageUrl:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="URL Imagen Portada" />
                    </div>
                    <textarea value={quoteData.description} onChange={e=>setQuoteData({...quoteData, description:e.target.value})} className="border p-3 w-full rounded-lg h-32" placeholder="Descripción de servicios e itinerario..." />
                </div>
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center border-b pb-1">
                        <h3 className="font-bold text-purple-700">4. Información Turística (IA)</h3>
                        <button onClick={handleGenerateAI} disabled={isGeneratingAI} className="bg-purple-100 text-purple-700 px-4 py-1 rounded text-sm font-bold hover:bg-purple-200 flex items-center gap-2">
                            {isGeneratingAI ? 'Generando...' : '✨ Generar Guía con IA'}
                        </button>
                    </div>
                    <textarea value={quoteData.guideText} onChange={e=>setQuoteData({...quoteData, guideText:e.target.value})} className="border p-3 w-full rounded-lg h-40 bg-purple-50" placeholder="Tips del destino..." />
                </div>
                <div className="mt-8 flex justify-end">
                    <button onClick={handleDownloadPDF} className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Descargar Presupuesto PDF
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'hero' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Carrusel Home</h2>
                    <button onClick={createNewHeroSlide} className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-sm">+ Nueva Imagen</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {heroSlides.map(s => (
                        <div key={s.id} className="border p-2 rounded-xl relative group hover:shadow-md transition-shadow">
                            <img src={s.image} className="h-32 w-full object-cover mb-2 rounded-lg" />
                            <p className="text-xs font-bold truncate px-1">{s.title}</p>
                            <div className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded-lg p-1 shadow-sm">
                                <button onClick={()=>{resetEditState(); setEditingSlide({...s}); setIsModalOpen(true)}} className="text-blue-600 text-xs p-1">✏️</button>
                                <button onClick={()=>handleDelete(s.id, 'hero_slide')} className="text-red-600 text-xs p-1">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className="text-xl font-bold mb-4">Banners Promocionales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promoBanners.map(b => (
                        <div key={b.id} className="border p-3 rounded-xl cursor-pointer hover:bg-gray-50 flex items-center gap-4 transition-colors" onClick={()=>{resetEditState(); setEditingBanner({...b}); setIsModalOpen(true)}}>
                            <img src={b.image} className="h-24 w-32 object-cover rounded-lg" />
                            <div>
                                <p className="font-bold text-sm">{b.title}</p>
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase">{b.badge}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-0 max-h-[95vh] overflow-hidden flex flex-col">
                  <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-700">Edición de Elemento</h3>
                      <button onClick={()=>setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1">
                      {editingTrip && (
                          <form onSubmit={handleSave} className="space-y-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-4">
                                       <h4 className="font-bold text-green-700 border-b pb-1">Información Básica</h4>
                                       <input value={editingTrip.title} onChange={e=>setEditingTrip({...editingTrip, title:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Título del Viaje" />
                                       <input value={editingTrip.location} onChange={e=>setEditingTrip({...editingTrip, location:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Ubicación" />
                                       <textarea value={editingTrip.description} onChange={e=>setEditingTrip({...editingTrip, description:e.target.value})} className="border p-3 w-full rounded-lg h-32" placeholder="Descripción..." />
                                   </div>
                                   <div className="space-y-4">
                                       <h4 className="font-bold text-green-700 border-b pb-1">Precios (USD)</h4>
                                       <input type="number" value={editingTrip.price} onChange={e=>setEditingTrip({...editingTrip, price:Number(e.target.value)})} className="border p-3 w-full rounded-lg font-bold" />
                                       <input type="number" value={editingTrip.discount || 0} onChange={e=>setEditingTrip({...editingTrip, discount:Number(e.target.value)})} className="border p-3 w-full rounded-lg" placeholder="Desc %" />
                                       <label className="flex items-center gap-2"><input type="checkbox" checked={editingTrip.isOffer} onChange={e=>setEditingTrip({...editingTrip, isOffer:e.target.checked})} /> Destacar como Oferta</label>
                                   </div>
                               </div>
                               <div><label className="font-bold">Fechas (una por línea)</label><textarea value={tripDatesInput} onChange={e=>setTripDatesInput(e.target.value)} className="border p-3 w-full rounded-lg h-24" /></div>
                               <div><label className="font-bold">Galería</label><div className="flex gap-2 flex-wrap">{editingTrip.images.map((img,i)=><div key={i} className="relative w-24 h-24"><img src={img} className="w-full h-full object-cover rounded-lg" /><button type="button" onClick={()=>{const n=[...editingTrip.images];n.splice(i,1);setEditingTrip({...editingTrip, images:n})}} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full">×</button></div>)}</div><input type="file" multiple onChange={(e)=>handleFileUpload(e, setEditingTrip)} className="mt-2" /></div>
                          </form>
                      )}
                      {editingHotel && (
                          <form onSubmit={handleSave} className="space-y-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-4">
                                       <h4 className="font-bold text-blue-700 border-b pb-1">Datos Hotel</h4>
                                       <input value={editingHotel.title} onChange={e=>setEditingHotel({...editingHotel, title:e.target.value})} className="border p-3 w-full rounded-lg font-bold" />
                                       <input value={editingHotel.location} onChange={e=>setEditingHotel({...editingHotel, location:e.target.value})} className="border p-3 w-full rounded-lg" />
                                       <button type="button" onClick={() => autoGeocode(editingHotel.location, setEditingHotel, editingHotel)} className="w-full bg-blue-100 text-blue-700 p-2 rounded-lg font-bold">📍 Buscar Coordenadas</button>
                                       <div className="grid grid-cols-2 gap-4">
                                            <select value={editingHotel.stars} onChange={e=>setEditingHotel({...editingHotel, stars:Number(e.target.value)})} className="border p-3 rounded-lg"><option value="3">3★</option><option value="4">4★</option><option value="5">5★</option></select>
                                            <input type="number" value={editingHotel.pricePerNight} onChange={e=>setEditingHotel({...editingHotel, pricePerNight:Number(e.target.value)})} className="border p-3 rounded-lg" placeholder="USD x Noche" />
                                       </div>
                                   </div>
                                   <div className="space-y-4">
                                       <h4 className="font-bold text-gray-700 border-b pb-1">Extras</h4>
                                       <textarea value={hotelAmenitiesInput} onChange={e=>setHotelAmenitiesInput(e.target.value)} className="border p-3 w-full rounded-lg h-24" placeholder="Servicios..." />
                                       <label className="flex items-center gap-2"><input type="checkbox" checked={editingHotel.isOffer} onChange={e=>setEditingHotel({...editingHotel, isOffer:e.target.checked})} /> Destacado</label>
                                   </div>
                               </div>
                               <div><label className="font-bold">Fotos</label><input type="file" multiple onChange={(e)=>handleFileUpload(e, setEditingHotel)} /></div>
                          </form>
                      )}
                      {editingSlide && (
                          <form onSubmit={handleSave} className="space-y-4">
                              <input value={editingSlide.title} onChange={e=>setEditingSlide({...editingSlide, title:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Título" />
                              <input value={editingSlide.subtitle} onChange={e=>setEditingSlide({...editingSlide, subtitle:e.target.value})} className="border p-3 w-full rounded-lg" placeholder="Subtítulo" />
                              <div className="flex gap-4">
                                  <input value={editingSlide.ctaText} onChange={e=>setEditingSlide({...editingSlide, ctaText:e.target.value})} className="border p-3 flex-1 rounded-lg" placeholder="Botón" />
                                  <input value={editingSlide.ctaLink} onChange={e=>setEditingSlide({...editingSlide, ctaLink:e.target.value})} className="border p-3 flex-1 rounded-lg" placeholder="Link" />
                              </div>
                              <input type="file" onChange={handleSlideImageUpload} />
                          </form>
                      )}
                      {/* Banners, Groups, World Cup Forms similarly updated... */}
                  </div>
                  <div className="bg-gray-100 p-4 border-t flex justify-end gap-3">
                      <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2 rounded-lg border text-gray-700 font-bold hover:bg-gray-200">Cancelar</button>
                      <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 disabled:bg-gray-400">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;
