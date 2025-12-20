
import { Trip, Apartment, Excursion, Hotel, InstallmentTrip, WorldCupTrip, GroupTrip, HeroSlide, PromoBanner, CarRental, DestinationGuide } from './types';

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
    description: `Florianópolis, cariñosamente llamada "Ilha da Magia", es un destino que combina perfectamente la infraestructura de una capital moderna con la preservación de playas paradisíacas.

Cultura: Descubrí la herencia de los inmigrantes azorianos en barrios como Santo Antônio de Lisboa y Ribeirão da Ilha, donde las fachadas coloridas y la gastronomía basada en ostras (Floripa es la capital nacional de la ostra) te transportarán al pasado.

Naturaleza: Desde las olas salvajes de Joaquina hasta las aguas calmas de Jurerê Internacional, hay una playa para cada gusto. No te pierdas la Lagoa da Conceição, el corazón de la isla, ideal para deportes náuticos y vida nocturna bohemia.`,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582260659632-475252e0000a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518005020250-eccddce1099a?q=80&w=2072&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=kYm_M89y-nI',
    highlights: [
      'Cata de ostras frescas en Ribeirão da Ilha',
      'Atardecer en Santo Antônio de Lisboa',
      'Trekking a la playa virgen de Lagoinha do Leste',
      'Visita al histórico Mercado Público en el Centro'
    ],
    active: true
  },
  {
    id: 'guide-bombinhas',
    name: 'Bombinhas',
    summary: 'La capital del buceo ecológico con las aguas más cristalinas del sur.',
    description: `Bombinhas es una península única en el sur de Brasil, famosa por sus bahías protegidas y aguas de color esmeralda. Es el destino preferido para quienes buscan tranquilidad y contacto directo con la vida marina.

Actividades: Al ser una reserva biológica marina, es el lugar ideal para el snorkeling. Playas como Sepultura y Retiro dos Padres ofrecen una visibilidad increíble incluso a pocos metros de la orilla.

Entorno: El centro es pintoresco y familiar, ideal para caminatas nocturnas. Además, su geografía permite disfrutar de vistas panorámicas espectaculares desde miradores como el Morro do Macaco.`,
    images: [
      'https://images.unsplash.com/photo-1519832276906-e77fa7478054?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588661299946-b3378345ec4f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621376856529-6c39f0f6a9e1?q=80&w=2071&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=9_n7Wz6k8tQ',
    highlights: [
      'Snorkeling guiado en la playa de Sepultura',
      'Avistamiento de ballenas francas (Julio a Octubre)',
      'Subida al Mirador del Morro do Macaco',
      'Paseo en barco pirata por la bahía'
    ],
    active: true
  },
  {
    id: 'guide-camboriu',
    name: 'Balneário Camboriú',
    summary: 'La "Dubai Brasileña": Rascacielos, lujo y entretenimiento sin fin.',
    description: `Balneário Camboriú es el epicentro del glamour en Santa Catarina. Conocida por tener los edificios más altos de Sudamérica, esta ciudad ofrece una experiencia vibrante y cosmopolita.

Infraestructura: El Parque Unipraias es su mayor joya, conectando la Playa Central con la Playa de Laranjeiras a través de modernos teleféricos. El nuevo paseo marítimo y la rueda gigante "Big Wheel" ofrecen postales inigualables.

Cultura y Noche:BC es famosa mundialmente por su vida nocturna, albergando algunos de los mejores clubes del planeta. Durante el día, las opciones de compras y gastronomía de clase mundial satisfacen a los viajeros más exigentes.`,
    images: [
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2064&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614272183204-629a8a70c327?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1632746400977-9ca28f9d0e74?q=80&w=2070&auto=format&fit=crop'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=FqS_X-jWkNo',
    highlights: [
      'Recorrido en teleférico en Parque Unipraias',
      'Vistas desde la FG Big Wheel',
      'Visita al Oceanic Aquarium (el más grande del sur)',
      'Cena en el Cristo Luz con vista panorámica'
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
    providerPrice: 45,
    profitMargin: 20,
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
    providerPrice: 20,
    profitMargin: 10,
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
        description: 'Auto ideal para parejas o familias pequeñas. Excelente consumo de combustible.',
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
