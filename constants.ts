
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
    subtitle: "Experiencias exclusivas y traslados premium en Florianópolis.",
    ctaText: "Ver Excursiones",
    ctaLink: "/excursions",
    highlightColor: "text-lime-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop",
    title: "TU VIAJE A MEDIDA",
    subtitle: "Conectamos tus sueños con las mejores playas de Brasil.",
    ctaText: "Explorar Tours",
    ctaLink: "/trips",
    highlightColor: "text-emerald-400"
  }
];

export const INITIAL_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner_rentacar',
    title: 'RENT A CAR FF',
    subtitle: 'Flota premium seleccionada para recorrer la isla a tu ritmo.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    badge: 'MOVILIDAD TOTAL',
    ctaText: 'Consultar Tarifas',
    link: '/cars'
  },
  {
    id: 'banner_transfers',
    title: 'TRANSFERS VIP',
    subtitle: 'Seguridad y confort desde el aeropuerto hasta tu posada.',
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
    description: 'Traslado privado en vehículo moderno con AC.',
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
    id: 'mov-mobi',
    title: 'Fiat Mobi - Grupo B (Económico)',
    brand: 'Fiat',
    category: 'Económico',
    providerPricePerDay: 14.90,
    profitMarginPerDay: 8.50,
    description: 'Perfecto para estacionar fácil y recorrer playas.',
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
  }
];

export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_GUIDES: DestinationGuide[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
