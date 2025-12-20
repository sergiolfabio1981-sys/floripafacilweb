
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental, DestinationGuide } from './types';

export const ADMIN_EMAIL = "sergiolfabio1981@gmail.com";
export const ADMIN_PASS = "Colo1981";

export const LOGO_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png"; 
export const LOGO_FALLBACK_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png";

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
    title: "FLORIPA FÁCIL",
    subtitle: "Tu puerta de entrada a experiencias exclusivas y traslados premium en la Isla de la Magia.",
    ctaText: "Ver Excursiones",
    ctaLink: "/excursions",
    highlightColor: "text-lime-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop",
    title: "DESCUBRÍ EL PARAÍSO",
    subtitle: "Planifica tu viaje soñado con el asesoramiento experto de Floripa Fácil.",
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

export const INITIAL_GUIDES: DestinationGuide[] = [
  {
    id: 'guide-florianopolis',
    name: 'Florianópolis',
    summary: 'La Isla de la Magia: 42 playas y una cultura azoriana vibrante.',
    description: `Floripa Fácil te lleva a conocer la isla de una manera diferente. Desde el norte sofisticado hasta el sur virgen.`,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    highlights: ['Playa Joaquina', 'Santo Antonio de Lisboa', 'Mercado Público'],
    active: true
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'ff-city-tour',
    title: 'City Tour Floripa Exclusive',
    location: 'Florianópolis, SC',
    providerPrice: 45,
    profitMargin: 20,
    description: 'Recorrido detallado por los puntos históricos, miradores y las playas más emblemáticas de la isla con el sello de Floripa Fácil.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Bus Panorámico', 'Guía Exclusivo FF', 'Tiempo de Playa'],
    included: ['Transporte VIP', 'Seguro de viaje', 'Guía acreditado'],
    notIncluded: ['Almuerzo', 'Tickets de ingreso'],
    meetingPoint: 'Pick up coordinado en tu alojamiento.'
  }
];

export const INITIAL_EXCURSIONS: Excursion[] = [];
export const INITIAL_CARS: CarRental[] = [];
export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
