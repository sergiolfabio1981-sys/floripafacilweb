
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

// DATA IMPORTADA DE MOVIDA (Precios convertidos BRL Mensual -> USD Diario)
// 1 BRL = 260 ARS | 1 USD = 1220 ARS
// Ejemplo Mobi: (2100 BRL / 30) = 70 BRL/día -> 70 * 260 = 18.200 ARS -> 18.200 / 1220 = 14.90 USD
export const INITIAL_CARS: CarRental[] = [
  {
    id: 'mov-mobi',
    title: 'Mobi 1.0 - Grupo B',
    brand: 'Fiat',
    category: 'Económico',
    providerPricePerDay: 14.90,
    profitMarginPerDay: 8.10,
    description: 'El vehículo más ágil para estacionar en las playas concurridas de Floripa. Consumo ultra bajo.',
    images: ['https://images.unsplash.com/photo-1621993202323-f438eec639ff?q=80&w=1000'],
    transmission: 'Manual',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 1,
    hasAC: true,
    location: 'Aeropuerto Florianópolis / Entrega en Hotel',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-polo',
    title: 'Polo 1.0 TSI - Grupo C',
    brand: 'Volkswagen',
    category: 'Compacto',
    providerPricePerDay: 19.20,
    profitMarginPerDay: 10.80,
    description: 'Confort y tecnología alemana. Ideal para parejas o familias pequeñas que buscan seguridad en ruta.',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000'],
    transmission: 'Manual',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Base Floripa Centro / Aeropuerto',
    isOffer: false,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-cronos',
    title: 'Cronos 1.3 AT - Grupo BS',
    brand: 'Fiat',
    category: 'Sedán',
    providerPricePerDay: 22.50,
    profitMarginPerDay: 12.50,
    description: 'Espacio de baúl inigualable (525L). La opción preferida de las familias argentinas con mucho equipaje.',
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
    title: 'T-Cross 200 TSI - Grupo SX',
    brand: 'Volkswagen',
    category: 'SUV',
    providerPricePerDay: 32.80,
    profitMarginPerDay: 17.20,
    description: 'SUV compacta premium con motor turbo. Potencia y altura ideal para explorar playas del sur y norte.',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 2,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Entregas Personalizadas',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'mov-compass',
    title: 'Compass Limited - Grupo LE',
    brand: 'Jeep',
    category: 'Luxury',
    providerPricePerDay: 48.50,
    profitMarginPerDay: 26.50,
    description: 'Lujo, robustez y máxima seguridad. Para quienes no aceptan menos que la excelencia en sus vacaciones.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 3,
    smallSuitcases: 2,
    hasAC: true,
    location: 'VIP Delivery Aeropuerto',
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
