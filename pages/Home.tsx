
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListingItem, HeroSlide, PromoBanner } from '../types';
import { getTrips } from '../services/tripService';
import { getExcursions } from '../services/excursionService';
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
            const [slides, banners, trips, excursions, cars] = await Promise.all([
                getHeroSlides(), getPromoBanners(), getTrips(), getExcursions(), getCarRentals()
            ]);
            setHeroSlides(slides);
            setPromoBanners(banners);
            const fullInventory = [
                ...trips.map(t => ({...t, type: 'trip' as const})),
                ...excursions.map(e => ({...e, type: 'excursion' as const})),
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-slate-100 border-t-[#22c55e] rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* HERO SECTION */}
      <div className="relative h-[750px] w-full overflow-hidden bg-slate-900">
        {heroSlides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}>
                <img src={slide.image} className="w-full h-full object-cover brightness-[0.45]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#064E3B]/40 to-slate-900/60 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-32 h-32 mb-8 bg-white/10 rounded-[2.5rem] flex items-center justify-center p-3 border border-white/20 shadow-2xl backdrop-blur-lg animate-pop-in">
                        <img 
                            src={LOGO_URL} 
                            className="w-full h-full object-contain" 
                            alt="Logo Floripa Fácil" 
                            onError={(e) => (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL}
                        />
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black text-white mb-6 animate-slide-up leading-none tracking-tightest uppercase italic">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl animate-slide-up font-medium tracking-tight" style={{animationDelay: '0.2s'}}>
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
                        <Link to={slide.ctaLink} className="px-12 py-5 rounded-[2rem] font-black bg-[#D9F99D] text-[#064E3B] hover:bg-white transition-all transform hover:scale-105 shadow-2xl uppercase tracking-widest text-[11px]">
                          {slide.ctaText}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FDFDFD] to-transparent z-20"></div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {heroSlides.map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-[#D9F99D] w-12' : 'bg-white/30 w-4 hover:bg-white/50'}`}
                />
            ))}
        </div>
      </div>

      {/* BRAND INTRODUCTION SECTION */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-30 mb-24">
          <div className="bg-white rounded-[4rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] p-10 md:p-20 border border-slate-50 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9F99D]/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-[#22c55e] blur-[40px] opacity-10 rounded-full animate-pulse"></div>
                  <div className="relative w-64 h-64 bg-slate-50 rounded-[3rem] p-6 border-2 border-white shadow-inner flex items-center justify-center">
                    <img 
                        src={LOGO_URL} 
                        className="w-full h-full object-contain" 
                        alt="Floripa Fácil" 
                    />
                  </div>
              </div>
              <div className="text-center md:text-left flex-1 relative z-10">
                  <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.4em] mb-4 block">Bienvenido a Floripa Fácil</span>
                  <h3 className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tightest mb-8 leading-[1.1] italic">
                    Transformamos tu viaje en una <span className="text-gradient">experiencia legendaria.</span>
                  </h3>
                  <p className="text-slate-500 text-xl leading-relaxed mb-10 font-medium max-w-2xl">
                    Somos líderes en turismo receptivo en Santa Catarina. Conectamos tus sueños con servicios exclusivos, atención VIP y traslados seguros en toda la isla.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                          <span className="text-2xl">🏆</span>
                          <div className="flex flex-col">
                              <span className="font-black text-[#064E3B] text-[11px] uppercase tracking-wider">Premium</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Servicio Verificado</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                          <span className="text-2xl">🛡️</span>
                          <div className="flex flex-col">
                              <span className="font-black text-[#064E3B] text-[11px] uppercase tracking-wider">Seguro</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Protección Total</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* BANNER PROMOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
            {promoBanners.map(banner => (
                <Link key={banner.id} to={banner.link} className="relative h-[450px] rounded-[3.5rem] overflow-hidden group shadow-2xl border-4 border-white transition-all duration-700 hover:-rotate-1">
                    <img src={banner.image} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 brightness-[0.7]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B] via-transparent to-transparent flex flex-col justify-end p-12">
                        <span className="bg-[#D9F99D] text-[#064E3B] text-[9px] font-black px-5 py-2 rounded-full w-fit mb-6 uppercase tracking-[0.2em] shadow-lg">
                            {banner.badge}
                        </span>
                        <h3 className="text-5xl font-black text-white mb-4 tracking-tightest uppercase italic leading-none group-hover:text-[#D9F99D] transition-colors">{banner.title}</h3>
                        <p className="text-white/80 text-lg mb-8 font-medium max-w-sm leading-relaxed">{banner.subtitle}</p>
                        <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em]">
                            Ver servicios <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>

        {/* ELEGIDOS SECTION */}
        {visibleOffers.length > 0 && (
          <div className="mb-40">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.4em] mb-4 block">Selección Especial</span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tightest uppercase italic leading-none">
                        Elegidos <span className="text-gradient">Premium</span>
                    </h2>
                </div>
                <div className="h-1 flex-1 bg-slate-100 mb-4 hidden md:block mx-10 rounded-full opacity-50"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {visibleOffers.slice(0,3).map(item => <TripCard key={item.id} trip={item} />)}
            </div>
          </div>
        )}

        {/* EXPLORER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-10">
             <div className="w-full lg:w-auto">
                <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-[0.4em] mb-4 block">Filtro Inteligente</span>
                <h2 className="text-5xl font-black text-slate-800 tracking-tightest uppercase italic mb-10 leading-none">Explorá tu próximo <span className="text-gradient">destino</span></h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                    {[
                        {id: 'all', label: 'Todo', icon: '✨'},
                        {id: 'car', label: 'Autos', icon: '🚗'},
                        {id: 'trip', label: 'Tours', icon: '🎒'},
                        {id: 'excursion', label: 'Traslados', icon: '🚐'}
                    ].map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveCategory(cat.id)} 
                            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 border ${
                                activeCategory === cat.id 
                                ? 'bg-[#064E3B] text-[#D9F99D] shadow-2xl scale-105 border-[#064E3B]' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-[#D9F99D] hover:text-[#064E3B]'
                            }`}
                        >
                            <span className="text-lg">{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>
             </div>
             <div className="relative w-full lg:w-[450px] group lg:mt-16">
                <input 
                  type="text" 
                  placeholder="¿A qué parte de Brasil viajas?" 
                  className="bg-white border border-slate-200 rounded-[2rem] px-10 py-6 w-full outline-none focus:ring-4 focus:ring-[#D9F99D]/50 focus:border-[#22c55e] transition-all font-bold shadow-sm text-lg placeholder:text-slate-300" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#22c55e] transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
             </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredItems.map(item => <TripCard key={item.id} trip={item} />)}
        </div>

        {filteredItems.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                <span className="text-8xl mb-8 block grayscale opacity-20">🏖️</span>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em]">No encontramos servicios con esos términos.</p>
                <button onClick={() => {setSearchTerm(''); setActiveCategory('all');}} className="mt-8 text-[#16A34A] font-black uppercase text-xs tracking-widest hover:underline">Ver todo el catálogo</button>
            </div>
        )}
      </div>

      <div className="mt-20">
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
