
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListingItem, HeroSlide, PromoBanner } from '../types';
import { getTrips } from '../services/tripService';
import { getRentals } from '../services/rentalService';
import { getExcursions } from '../services/excursionService';
import { getHotels } from '../services/hotelService';
import { getCarRentals } from '../services/carRentalService';
import { getHeroSlides, getPromoBanners } from '../services/heroService';
import { usePlanner } from '../contexts/PlannerContext';
import TripCard from '../components/TripCard';
import Testimonials from '../components/Testimonials';

const LOGO_URL = "https://i.ibb.co/L6WvF7X/Logo-Floripa-Facil.png";

const Home: React.FC = () => {
  const [combinedOffers, setCombinedOffers] = useState<ListingItem[]>([]);
  const [allItems, setAllItems] = useState<ListingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { selectedItems } = usePlanner();
  const selectedIds = selectedItems.map(i => i.id);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [slides, banners, trips, rentals, excursions, hotels, cars] = await Promise.all([
                getHeroSlides(), getPromoBanners(), getTrips(), getRentals(), getExcursions(), getHotels(), getCarRentals()
            ]);
            setHeroSlides(slides);
            setPromoBanners(banners);
            const fullInventory = [
                ...trips.map(t => ({...t, type: 'trip' as const})),
                ...rentals.map(r => ({...r, type: 'rental' as const})),
                ...excursions.map(e => ({...e, type: 'excursion' as const})),
                ...hotels.map(h => ({...h, type: 'hotel' as const})),
                ...cars.map(c => ({...c, type: 'car' as const}))
            ];
            setCombinedOffers(fullInventory.filter(item => item.isOffer));
            setAllItems(fullInventory.filter(item => !item.isOffer));
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredItems = allItems.filter(item => {
    if (selectedIds.includes(item.id)) return false;
    const titleToSearch = (item as any).title || (item as any).brand || '';
    const matchesSearch = titleToSearch.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const visibleOffers = combinedOffers.filter(item => !selectedIds.includes(item.id));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <div className="relative h-[650px] w-full overflow-hidden bg-gray-900">
        {heroSlides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={slide.image} className="w-full h-full object-cover brightness-[0.4]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <img src={LOGO_URL} className="w-44 h-44 mb-6 animate-pop-in drop-shadow-2xl object-contain bg-white rounded-full p-2 border-4 border-lime-500/20 shadow-2xl" alt="Floripa Fácil" />
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-4 animate-fade-in-up uppercase tracking-tighter italic">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in-up font-medium" style={{animationDelay: '0.2s'}}>
                      {slide.subtitle}
                    </p>
                    <Link to={slide.ctaLink} className="px-10 py-5 rounded-2xl font-black bg-lime-500 text-green-950 hover:bg-lime-400 transition-all transform hover:scale-105 shadow-2xl uppercase tracking-widest text-sm">
                      {slide.ctaText}
                    </Link>
                </div>
            </div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
      </div>

      {/* BRAND INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-30">
          <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0 bg-slate-50 p-4 rounded-full border-4 border-lime-100 shadow-inner">
                  <img src={LOGO_URL} className="w-48 h-48 object-contain rounded-full shadow-lg border-2 border-white" alt="Floripa Fácil" />
              </div>
              <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4 italic">
                    Tu conexión directa con el paraíso
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">
                    En <span className="text-green-600 font-bold">Floripa Fácil</span>, no solo vendemos viajes, creamos itinerarios a medida para que vivas Brasil como un local. Expertos en traslados, hospitalidad y experiencias exclusivas en Florianópolis y todo el litoral catarinense.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">🌴 100% Receptivo</span>
                      <span className="bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">🚗 Flota Propia</span>
                      <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">⭐ Calidad Premium</span>
                  </div>
              </div>
          </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {promoBanners.map(banner => (
                <Link key={banner.id} to={banner.link} className="relative h-72 rounded-[2.5rem] overflow-hidden group shadow-lg border-4 border-white hover:border-lime-400 transition-all">
                    <img src={banner.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-950/20 to-transparent flex flex-col justify-end p-10">
                        <span className="bg-lime-400 text-green-900 text-[10px] font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-widest shadow-lg">{banner.badge}</span>
                        <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">{banner.title}</h3>
                        <p className="text-white/80 text-sm mb-0 font-medium">{banner.subtitle}</p>
                    </div>
                </Link>
            ))}
        </div>

        {visibleOffers.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-1 w-12 bg-lime-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic">Ofertas Destacadas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {visibleOffers.slice(0,3).map(item => <TripCard key={item.id} trip={item} />)}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
             <div className="w-full lg:w-auto">
                <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic mb-6">Explorá más opciones</h2>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {[
                        {id: 'all', label: 'Todos', icon: '🌐'},
                        {id: 'car', label: 'Autos', icon: '🚗'},
                        {id: 'trip', label: 'Paquetes', icon: '📦'},
                        {id: 'excursion', label: 'Traslados', icon: '🚐'},
                        {id: 'hotel', label: 'Hoteles', icon: '🏨'},
                        {id: 'rental', label: 'Casas', icon: '🏠'}
                    ].map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === cat.id ? 'bg-green-600 text-white shadow-xl' : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-lime-200'}`}>
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>
             </div>
             <div className="relative w-full lg:w-96 group">
                <input 
                  type="text" 
                  placeholder="¿A dónde quieres ir?" 
                  className="bg-white border-2 border-gray-100 rounded-2xl px-8 py-5 w-full outline-none focus:border-lime-500 transition-all font-bold shadow-sm" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-lime-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
             </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map(item => <TripCard key={item.id} trip={item} />)}
            {filteredItems.length === 0 && !isLoading && (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                <div className="text-6xl mb-4">🏝️</div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-lg">No encontramos lo que buscas hoy...</p>
                <button onClick={()=>{setSearchTerm(''); setActiveCategory('all')}} className="text-green-600 font-black uppercase tracking-widest mt-4 hover:underline">Ver todo el catálogo</button>
              </div>
            )}
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;