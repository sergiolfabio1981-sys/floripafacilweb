
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
    subtitle: 'Flota propia y moderna para recorrer cada rincón de Floripa a tu ritmo.',
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
  },
  {
    id: 'trip-2',
    title: 'Parque Unipraias Completo',
    location: 'Camboriú, SC',
    providerPrice: 35,
    profitMargin: 15,
    description: 'Teleférico, senderos ecológicos y la mejor vista de Balneario Camboriú.',
    images: ['https://images.unsplash.com/photo-1612361730058-297597984f93?q=80&w=2070'],
    isOffer: false,
    availableDates: ['Martes', 'Jueves', 'Sábados'],
    baseCurrency: 'USD',
    type: 'trip'
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

export const INITIAL_CARS: CarRental[] = [
  {
    id: 'car-premium-1',
    title: 'Hyundai HB20 - Automático',
    brand: 'Hyundai',
    category: 'Económico',
    providerPricePerDay: 28,
    profitMarginPerDay: 12,
    description: 'Vehículo moderno y ágil, ideal para moverse por toda la isla de Florianópolis con bajo consumo y máximo confort.',
    images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000&auto=format'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Aeropuerto Florianópolis',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'car-premium-2',
    title: 'Jeep Compass - SUV',
    brand: 'Jeep',
    category: 'SUV',
    providerPricePerDay: 45,
    profitMarginPerDay: 20,
    description: 'Experimenta la libertad con un SUV de alta gama. Perfecto para viajes familiares hacia Bombinhas o Camboriú.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 2,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Entregas en Hotel',
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
