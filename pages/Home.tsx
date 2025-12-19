
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListingItem, HeroSlide, PromoBanner } from '../types';
import { getTrips } from '../services/tripService';
import { getRentals } from '../services/rentalService';
import { getExcursions } from '../services/excursionService';
import { getHotels } from '../services/hotelService';
import { getHeroSlides, getPromoBanners } from '../services/heroService';
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

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [slides, banners, trips, rentals, excursions, hotels] = await Promise.all([
                getHeroSlides(), getPromoBanners(), getTrips(), getRentals(), getExcursions(), getHotels()
            ]);
            setHeroSlides(slides);
            setPromoBanners(banners);
            const fullInventory = [
                ...trips.map(t => ({...t, type: 'trip' as const})),
                ...rentals.map(r => ({...r, type: 'rental' as const})),
                ...excursions.map(e => ({...e, type: 'excursion' as const})),
                ...hotels.map(h => ({...h, type: 'hotel' as const}))
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
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
        {heroSlides.map((slide, index) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={slide.image} className="w-full h-full object-cover brightness-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in-up uppercase tracking-tighter">{slide.title}</h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>{slide.subtitle}</p>
                    <Link to={slide.ctaLink} className="px-8 py-4 rounded-full font-bold bg-lime-500 text-green-950 hover:bg-lime-400 transition-all transform hover:scale-105 shadow-xl">{slide.ctaText}</Link>
                </div>
            </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {promoBanners.map(banner => (
                <Link key={banner.id} to={banner.link} className="relative h-64 rounded-3xl overflow-hidden group shadow-lg border-2 border-transparent hover:border-lime-400 transition-all">
                    <img src={banner.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 to-transparent flex flex-col justify-end p-8">
                        <span className="bg-lime-400 text-green-950 text-[10px] font-black px-3 py-1 rounded-full w-fit mb-3">{banner.badge}</span>
                        <h3 className="text-2xl font-bold text-white mb-1">{banner.title}</h3>
                        <p className="text-white/70 text-sm mb-4">{banner.subtitle}</p>
                    </div>
                </Link>
            ))}
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-8 border-lime-500 pl-4">Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {combinedOffers.slice(0,3).map(item => <TripCard key={item.id} trip={item} />)}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
             <div>
                <h2 className="text-3xl font-bold text-gray-800">Toda nuestra oferta</h2>
                <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
                    {['all', 'excursion', 'trip', 'hotel', 'rental'].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${activeCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border'}`}>
                            {cat === 'all' ? 'Todos' : cat === 'trip' ? 'Paseos' : cat === 'excursion' ? 'Traslados' : cat}
                        </button>
                    ))}
                </div>
             </div>
             <input type="text" placeholder="Buscar destino..." className="border rounded-full px-6 py-3 w-full md:w-80 outline-none focus:ring-2 focus:ring-lime-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredItems.map(item => <TripCard key={item.id} trip={item} />)}
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
