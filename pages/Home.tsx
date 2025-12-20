
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
import { LOGO_URL, LOGO_FALLBACK_URL } from '../constants';
import TripCard from '../components/TripCard';
import Testimonials from '../components/Testimonials';

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
                    <div className="w-40 h-40 mb-6 bg-white/10 rounded-full flex items-center justify-center p-2 border-4 border-white/20 shadow-2xl backdrop-blur-sm overflow-hidden">
                        <img 
                          src={LOGO_URL} 
                          className="w-full h-full object-contain" 
                          alt="Logo ABRAS" 
                          onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                        />
                    </div>
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

      {/* BRAND INTRODUCTION ABRAS TRAVEL */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-30">
          <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0 bg-slate-50 p-4 rounded-full border-4 border-lime-100 shadow-inner w-56 h-56 flex items-center justify-center overflow-hidden">
                  <img 
                    src={LOGO_URL} 
                    className="w-full h-full object-contain rounded-full shadow-lg" 
                    alt="ABRAS Travel" 
                    onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                  />
              </div>
              <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4 italic">
                    Viajá diferente con ABRAS Travel
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                    En <span className="text-green-600 font-bold">ABRAS Travel</span>, elevamos tu experiencia de viaje. Consultá con <span className="text-lime-600 font-bold">Flori AI</span> para armar tu itinerario o contactá a nuestros asesores directos por WhatsApp para una atención personalizada.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                      <a 
                        href="https://wa.me/message/TVC7DUGWGV27G1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:bg-[#20bd5a] transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                        Asesoría Humana
                      </a>
                      <button 
                        onClick={() => {
                          const botButton = document.querySelector('button[aria-label="Abrir chat con Flori"]') as HTMLButtonElement;
                          if (botButton) botButton.click();
                        }}
                        className="bg-white border-2 border-lime-500 text-green-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-sm hover:bg-lime-50 transition-all w-full sm:w-auto justify-center"
                      >
                        ⚡ Hablar con Flori AI
                      </button>
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
                <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic">Elegidos ABRAS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {visibleOffers.slice(0,3).map(item => <TripCard key={item.id} trip={item} />)}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
             <div className="w-full lg:w-auto">
                <h2 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic mb-6">Explorá tu destino</h2>
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
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
