
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental, DestinationGuide } from './types';

export const ADMIN_EMAIL = "sergiolfabio1981@gmail.com";
export const ADMIN_PASS = "Colo1981";

export const LOGO_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png"; 
export const LOGO_FALLBACK_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png";

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=2070&auto=format&fit=crop",
    title: "FLORIPA FÁCIL",
    subtitle: "Tu puerta de entrada a experiencias exclusivas y traslados premium en la Isla de la Magia.",
    ctaText: "Ver Excursiones",
    ctaLink: "/excursions",
    highlightColor: "text-lime-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop",
    title: "BOMBINHAS & CAMBORIÚ",
    subtitle: "Explora las aguas cristalinas y la energía vibrante del sur brasileño con nosotros.",
    ctaText: "Explorar Tours",
    ctaLink: "/trips",
    highlightColor: "text-emerald-400"
  }
];

export const INITIAL_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner_rentacar',
    title: 'RENT A CAR FF',
    subtitle: 'Flota Movida seleccionada para recorrer cada rincón de Floripa a tu ritmo.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    badge: 'MOVILIDAD TOTAL',
    ctaText: 'Consultar Tarifas',
    link: '/cars'
  },
  {
    id: 'banner_transfers',
    title: 'TRANSFERS VIP',
    subtitle: 'Seguridad y confort desde el Aeropuerto FLN hasta tu alojamiento.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    badge: 'SERVICIO PREMIUM',
    ctaText: 'Ver Servicios',
    link: '/excursions'
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    title: 'Tour Escuna: Isla Anhatomirim',
    location: 'Florianópolis, SC',
    providerPrice: 28,
    profitMargin: 12,
    description: 'Navegación histórica con avistaje de delfines y visita a fortalezas.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Delfines', 'Historia', 'Baño en mar']
  }
];

export const INITIAL_EXCURSIONS: Excursion[] = [
  {
    id: 'exc-1',
    title: 'Transfer Aeropuerto FLN a Canasvieiras',
    location: 'Florianópolis, SC',
    providerPrice: 15,
    profitMargin: 10,
    description: 'Traslado privado en Sedán con AC.',
    images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021'],
    isOffer: false,
    duration: '45 min',
    availableDates: ['24/7'],
    baseCurrency: 'USD',
    type: 'excursion'
  }
];

// DATA EXTRAÍDA DE MOVIDA FROTAS
// Cálculo: (Precio Mensual BRL / 30) * $260 ARS -> Luego convertido a USD (Base 1220) para gestión de márgenes.
export const INITIAL_CARS: CarRental[] = [
  {
    id: 'mov-mobi',
    title: 'Fiat Mobi - Grupo B (Económico)',
    brand: 'Fiat',
    category: 'Económico',
    providerPricePerDay: 14.90, // Aprox $18.200 ARS
    profitMarginPerDay: 8.50,
    description: 'Perfecto para la ciudad y accesos a playas. Muy económico y fácil de estacionar. Aire acondicionado incluido.',
    images: ['https://images.unsplash.com/photo-1621993202323-f438eec639ff?q=80&w=1000'],
    transmission: 'Manual',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 1,
    hasAC: true,
    location: 'Aeropuerto Florianópolis',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-polo',
    title: 'VW Polo - Grupo C (Compacto)',
    brand: 'Volkswagen',
    category: 'Compacto',
    providerPricePerDay: 19.50, 
    profitMarginPerDay: 10.50,
    description: 'Moderno, seguro y con excelente conectividad. Motor TSI de alta eficiencia para rutas brasileñas.',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000'],
    transmission: 'Manual',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Entrega en Hotel / Aeropuerto',
    isOffer: false,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-cronos',
    title: 'Fiat Cronos - Grupo BS (Sedán)',
    brand: 'Fiat',
    category: 'Sedán',
    providerPricePerDay: 22.80,
    profitMarginPerDay: 12.20,
    description: 'El sedán más espacioso de su categoría. Ideal para familias con maletas grandes que viajan desde Argentina.',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 2,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Aeropuerto Florianópolis',
    isOffer: false,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-tcross',
    title: 'VW T-Cross - Grupo SX (SUV)',
    brand: 'Volkswagen',
    category: 'SUV',
    providerPricePerDay: 33.50,
    profitMarginPerDay: 16.50,
    description: 'SUV de última generación. Máximo confort y despeje del suelo, ideal para explorar playas del sur como Matadeiro.',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 2,
    smallSuitcases: 2,
    hasAC: true,
    location: 'VIP Delivery',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-compass',
    title: 'Jeep Compass - Grupo LE (SUV Special)',
    brand: 'Jeep',
    category: 'Luxury',
    providerPricePerDay: 49.00,
    profitMarginPerDay: 26.00,
    description: 'Experiencia premium total. Robustez Jeep con tecnología de lujo para las vacaciones más exclusivas.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 3,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Aeropuerto Internacional FLN',
    isOffer: false,
    baseCurrency: 'USD',
    type: 'car'
  }
];

export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_GUIDES: DestinationGuide[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
