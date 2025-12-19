
export interface Trip {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
  isOffer: boolean;
  offerExpiresAt?: string; 
  availableDates: string[];
  discount?: number;
  includesFlight?: boolean;
  rating?: number;
  reviewsCount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  durationLabel?: string;
  type?: 'trip';
}

export interface GroupTrip {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
  isOffer: boolean;
  availableDates: string[];
  discount?: number;
  includesFlight?: boolean;
  rating?: number;
  reviewsCount?: number;
  specialLabel?: string;
  durationLabel?: string;
  baseCurrency?: 'ARS' | 'USD';
  type?: 'group';
}

export interface Apartment {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  description: string;
  images: string[];
  bedrooms: number;
  maxGuests: number;
  amenities: string[];
  isOffer?: boolean;
  offerExpiresAt?: string;
  lat?: number;
  lng?: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  type?: 'rental';
}

export interface Hotel {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  description: string;
  images: string[];
  stars: number;
  amenities: string[];
  isOffer: boolean;
  offerExpiresAt?: string;
  lat?: number;
  lng?: number;
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  type?: 'hotel';
}

export interface CarRental {
  id: string;
  title: string; // Ej: Chevrolet Onix o Similar
  brand: string;
  category: string; // Económico, SUV, Luxury, etc.
  pricePerDay: number;
  description: string;
  images: string[];
  transmission: 'Manual' | 'Automático';
  fuel: 'Nafta' | 'Diesel' | 'Híbrido' | 'Eléctrico';
  doors: number;
  passengers: number;
  largeSuitcases: number;
  smallSuitcases: number;
  hasAC: boolean;
  location: string;
  isOffer: boolean;
  discount?: number;
  baseCurrency?: 'ARS' | 'USD' | 'BRL';
  type?: 'car';
}

export interface Excursion {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: string[];
  isOffer: boolean;
  offerExpiresAt?: string;
  duration: string;
  availableDates: string[];
  discount?: number;
  rating?: number;
  reviewsCount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  type?: 'excursion';
}

export interface InstallmentTrip {
  id: string;
  title: string;
  location: string;
  totalPrice: number;
  description: string;
  images: string[];
  departureDate: string;
  isOffer: boolean;
  discount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  type?: 'installment';
}

export interface WorldCupTrip {
  id: string;
  title: string;
  location: string;
  totalPrice: number;
  description: string;
  images: string[];
  departureDate: string;
  originCountry: string;
  isOffer: boolean;
  discount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  type?: 'worldcup';
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  highlightColor: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  ctaText: string;
  link: string;
}

export type ListingItem = Trip | Apartment | Excursion | Hotel | InstallmentTrip | WorldCupTrip | GroupTrip | CarRental;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
