
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner } from './types';

export const ADMIN_EMAIL = "sergiolfabio1981@gmail.com";
export const ADMIN_PASS = "Colo1981";

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
    title: "VIVÍ FLORIANÓPOLIS",
    subtitle: "Excursiones exclusivas, paseos en barco y los mejores traslados en la Isla de la Magia.",
    ctaText: "Ver Excursiones",
    ctaLink: "/excursions",
    highlightColor: "text-lime-400"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop",
    title: "BOMBINHAS & MÁS",
    subtitle: "Explorá las aguas cristalinas del litoral catarinense con nuestros tours guiados.",
    ctaText: "Explorar Tours",
    ctaLink: "/trips",
    highlightColor: "text-emerald-400"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2064&auto=format&fit=crop",
    title: "TRASLADOS SEGUROS",
    subtitle: "Servicio de transfer desde aeropuertos (FLN, BNU) a tu hotel con la mayor comodidad.",
    ctaText: "Reservar Traslado",
    ctaLink: "/excursions",
    highlightColor: "text-green-400"
  }
];

export const INITIAL_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'banner_rentacar',
    title: 'ALQUILER DE COCHES',
    subtitle: 'Recorré las 42 playas de Floripa a tu propio ritmo. Los mejores precios.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    badge: 'MOVILIDAD TOTAL',
    ctaText: 'Consultar Tarifas',
    link: '/contact'
  },
  {
    id: 'banner_transfers',
    title: 'TRANSFERS PRIVADOS',
    subtitle: 'Llegá a tu destino sin complicaciones. Florianópolis, Camboriú y Bombinhas.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    badge: 'PUERTA A PUERTA',
    ctaText: 'Ver Servicios',
    link: '/excursions'
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'floripa-receptivo-1',
    title: 'Paseo Cultural Centro Histórico',
    location: 'Florianópolis, SC',
    price: 45,
    description: 'Recorrido por la Catedral, el Mercado Público y el Palacio Cruz e Sousa. Incluye cata de café típico.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    durationLabel: '5 HORAS',
    availableDates: ['Diario'],
    includesFlight: false,
    rating: 9.2,
    reviewsCount: 45,
    baseCurrency: 'USD',
    type: 'trip',
    specialLabel: 'CULTURA'
  },
  {
    id: 'bombinhas-snorkeling',
    title: 'Aventura Snorkel en Bombinhas',
    location: 'Bombinhas, SC',
    price: 65,
    description: 'Visitamos las playas de Sepultura y Retiro dos Padres. Equipamiento incluido y guía certificado.',
    images: ['https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop'],
    isOffer: false,
    durationLabel: 'FULL DAY',
    availableDates: ['Lunes', 'Miércoles', 'Sábado'],
    includesFlight: false,
    rating: 9.5,
    reviewsCount: 120,
    baseCurrency: 'USD',
    type: 'trip',
    specialLabel: 'NATURALEZA'
  }
];

export const INITIAL_EXCURSIONS: Excursion[] = [
  {
    id: 'exc-transfer-fln',
    title: 'Traslado Aeropuerto FLN - Canasvieiras',
    location: 'Florianópolis',
    price: 30,
    description: 'Servicio receptivo en el Aeropuerto Internacional de Florianópolis (Hercílio Luz). Vehículos con aire acondicionado.',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'],
    isOffer: true,
    duration: '1 Hora aprox.',
    availableDates: ['Todos los días / 24hs'],
    rating: 9.8,
    reviewsCount: 300,
    baseCurrency: 'USD',
    type: 'excursion',
    specialLabel: 'TRASLADO'
  },
  {
    id: 'exc-camboriu-cristo',
    title: 'Tour Balneario Camboriú y Cristo Luz',
    location: 'Camboriú, SC',
    price: 55,
    description: 'Visita panorámica por la costanera, Parque Unipraias y ascenso al monumento Cristo Luz al atardecer.',
    images: ['https://images.unsplash.com/photo-1555979869-7da2696b738e?q=80&w=1974&auto=format&fit=crop'],
    isOffer: false,
    duration: '8 Horas',
    availableDates: ['Martes', 'Viernes', 'Domingo'],
    rating: 9.0,
    reviewsCount: 85,
    baseCurrency: 'USD',
    type: 'excursion'
  }
];

export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
