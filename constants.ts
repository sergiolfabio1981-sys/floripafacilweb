
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental, DestinationGuide } from './types';

export const ADMIN_EMAIL = "sergiolfabio1981@gmail.com";
export const ADMIN_PASS = "Colo1981";

export const LOGO_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png"; 
export const LOGO_FALLBACK_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png";

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
    title: "VIVÍ FLORIANÓPOLIS",
    subtitle: "Excursiones exclusivas, paseos en barco y los mejores traslados con el sello Floripa Fácil.",
    ctaText: "Ver Excursiones",
    ctaLink: "/excursions",
    highlightColor: "text-lime-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop",
    title: "BOMBINHAS & MÁS",
    subtitle: "Explorá las aguas cristalinas del sur de Brasil con nuestros guías expertos.",
    ctaText: "Explorar Tours",
    ctaLink: "/trips",
    highlightColor: "text-emerald-400"
  }
];

export const INITIAL_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner_rentacar',
    title: 'ALQUILER DE COCHES',
    subtitle: 'Recorré las 42 playas de la isla a tu propio ritmo con nuestra flota.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    badge: 'MOVILIDAD TOTAL',
    ctaText: 'Consultar Tarifas',
    link: '/cars'
  },
  {
    id: 'banner_transfers',
    title: 'TRANSFERS PRIVADOS',
    subtitle: 'Llegadas seguras y cómodas desde el Aeropuerto FLN a tu hotel.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    badge: 'PUERTA A PUERTA',
    ctaText: 'Ver Servicios',
    link: '/excursions'
  }
];

export const INITIAL_GUIDES: DestinationGuide[] = [
  {
    id: 'guide-florianopolis',
    name: 'Florianópolis',
    summary: 'La Isla de la Magia: 42 playas y una cultura azoriana vibrante.',
    description: `Florianópolis combina perfectamente infraestructura moderna con naturaleza virgen. Floripa Fácil te garantiza la mejor experiencia receptiva.`,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    highlights: ['Playa Joaquina', 'Santo Antonio de Lisboa', 'Mercado Público'],
    active: true
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'floripa-city-tour',
    title: 'City Tour Florianópolis Completo',
    location: 'Florianópolis, SC',
    providerPrice: 45,
    profitMargin: 20,
    description: 'Recorrido detallado por los puntos históricos, miradores y las playas más emblemáticas de la isla.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Bus Panorámico', 'Guía en Español/Portugués', 'Tiempo de Playa'],
    included: ['Transporte ida y vuelta', 'Seguro de viaje', 'Guía acreditado'],
    notIncluded: ['Almuerzo', 'Tickets de ingreso'],
    meetingPoint: 'Pick up en hoteles del Norte (Ingleses, Canasvieiras, Jurerê).'
  }
];

export const INITIAL_EXCURSIONS: Excursion[] = [];
export const INITIAL_CARS: CarRental[] = [];
export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
