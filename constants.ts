
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental, DestinationGuide } from './types';

export const ADMIN_EMAIL = "sergiolfabio1981@gmail.com";
export const ADMIN_PASS = "Colo1981";

// URL oficial proporcionada por el usuario (Link directo)
export const LOGO_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png"; 
export const LOGO_FALLBACK_URL = "https://i.ibb.co/ymdsLXHV/Blue-Yellow-Classic-Retro-Beach-Resort-Logo-1.png";

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
    link: '/cars'
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

export const INITIAL_GUIDES: DestinationGuide[] = [
  {
    id: 'guide-florianopolis',
    name: 'Florianópolis',
    summary: 'La Isla de la Magia: 42 playas, cultura azoriana y naturaleza virgen.',
    description: `Florianópolis, cariñosamente llamada "Ilha da Magia", es un destino que combina perfectamente la infraestructura de una capital moderna con la preservación de playas paradisíacas.`,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582260659632-475252e0000a?q=80&w=2070&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kYm_M89y-nI',
    highlights: [
      'Cata de ostras frescas en Ribeirão da Ilha',
      'Atardecer en Santo Antônio de Lisboa'
    ],
    active: true
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'floripa-receptivo-1',
    title: 'Paseo Cultural Centro Histórico',
    location: 'Florianópolis, SC',
    providerPrice: 30,
    profitMargin: 15,
    description: 'Recorrido por la Catedral, el Mercado Público y el Palacio Cruz e Sousa.',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop'],
    isOffer: true,
    availableDates: ['Diario'],
    baseCurrency: 'USD',
    type: 'trip'
  }
];

export const INITIAL_EXCURSIONS: Excursion[] = [
  {
    id: 'exc-transfer-fln',
    title: 'Traslado Aeropuerto FLN - Canasvieiras',
    location: 'Florianópolis',
    providerPrice: 20,
    profitMargin: 10,
    description: 'Servicio receptivo en el Aeropuerto Internacional de Florianópolis.',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'],
    isOffer: true,
    duration: '1 Hora aprox.',
    availableDates: ['Todos los días / 24hs'],
    baseCurrency: 'USD',
    type: 'excursion'
  }
];

export const INITIAL_CARS: CarRental[] = [
    {
        id: 'car-onix-std',
        brand: 'Chevrolet',
        title: 'Onix o Similar',
        category: 'Económico',
        providerPricePerDay: 30,
        profitMarginPerDay: 10,
        description: 'Auto ideal para parejas o familias pequeñas.',
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'],
        transmission: 'Manual',
        fuel: 'Nafta',
        doors: 4,
        passengers: 5,
        largeSuitcases: 1,
        smallSuitcases: 2,
        hasAC: true,
        location: 'Florianópolis',
        isOffer: true,
        baseCurrency: 'USD',
        type: 'car'
    }
];

export const INITIAL_RENTALS: Apartment[] = [];
export const INITIAL_HOTELS: Hotel[] = [];
export const INITIAL_INSTALLMENT_TRIPS: InstallmentTrip[] = [];
export const INITIAL_WORLDCUP_TRIPS: WorldCupTrip[] = [];
export const INITIAL_GROUP_TRIPS: GroupTrip[] = [];
