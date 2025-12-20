
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

// --- TOURS Y PAQUETES (TRIPS) ---
// Precios calculados: Proveedor + 50% Margen
export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'tour-escuna-anhitomerim',
    title: 'Paseo en Escuna: Isla Anhatomirim y Delfines',
    location: 'Florianópolis, SC',
    providerPrice: 30,
    profitMargin: 15,
    description: 'Navega por la bahía norte, visita la fortaleza histórica de Anhatomirim y disfruta del avistamiento de delfines en su hábitat natural. Incluye parada para almuerzo en la costa.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Avistaje de Delfines', 'Fuerte Histórico', 'Navegación Panorámica'],
    included: ['Guía bilingüe', 'Tasa de embarque', 'Seguro'],
    notIncluded: ['Almuerzo', 'Bebidas'],
    meetingPoint: 'Trapiche de Canasvieiras'
  },
  {
    id: 'tour-unipraias-camboriu',
    title: 'Parque Unipraias y City Tour Balneario',
    location: 'Camboriú, SC',
    providerPrice: 40,
    profitMargin: 20,
    description: 'Descubre la "Dubai brasileña" desde las alturas en el teleférico de Unipraias. Recorrido por la Av. Atlántica y visita a la Playa de Laranjeiras.',
    images: ['https://images.unsplash.com/photo-1612361730058-297597984f93?q=80&w=2070&auto=format&fit=crop'],
    isOffer: false,
    availableDates: ['Martes', 'Jueves', 'Sábados'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Teleférico', 'Playa Laranjeiras', 'Vistas Panorámicas'],
    included: ['Traslado ida y vuelta', 'Ticket Teleférico', 'Guía'],
    meetingPoint: 'Pick up en hoteles céntricos de Camboriú'
  },
  {
    id: 'tour-bombinhas-4x4',
    title: 'Safari 4x4 Playas de Bombinhas',
    location: 'Bombinhas, SC',
    providerPrice: 36,
    profitMargin: 18,
    description: 'Aventura total recorriendo las playas más escondidas de Bombinhas en vehículos 4x4. Visitamos Mirante de Bombas, Quatro Ilhas y Mariscal.',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip',
    highlights: ['Acceso a playas vírgenes', 'Miradores fotográficos', 'Aventura off-road'],
    included: ['Vehículo 4x4', 'Conductor/Guía', 'Agua mineral'],
    meetingPoint: 'Centro de Bombinhas'
  }
];

// --- TRASLADOS Y EXCURSIONES CORTAS (EXCURSIONS) ---
export const INITIAL_EXCURSIONS: Excursion[] = [
  {
    id: 'transfer-fln-canasvieiras',
    title: 'Transfer Aeropuerto FLN a Canasvieiras / Ingleses',
    location: 'Florianópolis, SC',
    providerPrice: 20,
    profitMargin: 10,
    description: 'Servicio de traslado compartido o privado desde el Aeropuerto Internacional de Florianópolis (Hercilio Luz) hacia el norte de la isla.',
    images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'],
    isOffer: false,
    duration: '45 - 60 min',
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'excursion',
    highlights: ['Espera con cartel', 'Vehículos con AC', 'Asistencia de equipaje'],
    included: ['Traslado directo', 'Seguro de pasajero'],
    meetingPoint: 'Puerta de arribos nacionales/internacionales'
  },
  {
    id: 'transfer-fln-bombinhas',
    title: 'Transfer Aeropuerto FLN a Bombinhas / Mariscal',
    location: 'Bombinhas, SC',
    providerPrice: 50,
    profitMargin: 25,
    description: 'Traslado confortable hacia la capital del buceo. Trayecto por BR-101 con conductores profesionales.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    duration: '1h 30min',
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'excursion',
    highlights: ['Ruta segura', 'Conexión directa', 'WiFi a bordo (sujeto a disponibilidad)'],
    included: ['Peajes', 'Traslado puerta a puerta'],
    meetingPoint: 'Aeropuerto FLN'
  }
];

// --- ALQUILER DE AUTOS (CARS) ---
export const INITIAL_CARS: CarRental[] = [
  {
    id: 'car-onix-economico',
    title: 'Chevrolet Onix o similar',
    brand: 'Chevrolet',
    category: 'Económico',
    providerPricePerDay: 24,
    profitMarginPerDay: 12,
    description: 'El vehículo ideal para parejas o grupos pequeños que buscan economía y agilidad para recorrer las 42 playas de la isla.',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'],
    transmission: 'Manual',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 1,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Florianópolis / Aeropuerto',
    isOffer: true,
    baseCurrency: 'USD',
    type: 'car'
  },
  {
    id: 'car-renegade-suv',
    title: 'Jeep Renegade SUV',
    brand: 'Jeep',
    category: 'SUV',
    providerPricePerDay: 44,
    profitMarginPerDay: 22,
    description: 'Potencia y confort para terrenos más exigentes o viajes largos por el litoral catarinense.',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'],
    transmission: 'Automático',
    fuel: 'Nafta',
    doors: 4,
    passengers: 5,
    largeSuitcases: 2,
    smallSuitcases: 2,
    hasAC: true,
    location: 'Florianópolis / Camboriú',
    isOffer: false,
    baseCurrency: 'USD',
    type: 'car'
  }
];

export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
