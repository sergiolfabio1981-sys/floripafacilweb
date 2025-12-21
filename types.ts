
export type UserRole = 'admin' | 'seller';

export interface Destination {
  id: string;
  name: string;
  active: boolean;
}

export interface DestinationGuide {
  id: string;
  name: string;
  summary: string;
  description: string;
  images: string[];
  videoUrl?: string;
  highlights: string[];
  active: boolean;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  totalSales: number;
  active: boolean;
  role: 'seller' | 'admin';
}

export interface Sale {
  id: string;
  sellerId: string;
  sellerName: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  totalProfit: number;
  commissionAmount: number;
  date: string;
  items: string[];
}

export interface AppMessage {
  id: string;
  sender_name: string;
  sender_id?: string; // Si es interno
  receiver_id?: string; // Para mensajes directos, null = para todos los admins
  subject: string;
  body: string;
  type: 'contact' | 'booking' | 'internal';
  created_at: string;
  is_read: boolean;
  metadata?: any; // Para guardar datos extra de reservas
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  providerPrice: number;
  profitMargin: number;
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
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  meetingPoint?: string;
  importantInfo?: string;
  cancellationPolicy?: string;
}

export interface Apartment {
  id: string;
  title: string;
  location: string;
  providerPricePerNight: number;
  profitMarginPerNight: number;
  description: string;
  images: string[];
  bedrooms: number;
  maxGuests: number;
  amenities: string[];
  isOffer?: boolean;
  type?: 'rental';
  baseCurrency?: 'ARS' | 'USD';
  lat?: number;
  lng?: number;
  discount?: number;
  specialLabel?: string;
}

export interface Hotel {
  id: string;
  title: string;
  location: string;
  providerPricePerNight: number;
  profitMarginPerNight: number;
  description: string;
  images: string[];
  stars: number;
  amenities: string[];
  isOffer: boolean;
  type?: 'hotel';
  baseCurrency?: 'ARS' | 'USD';
  lat?: number;
  lng?: number;
  discount?: number;
  specialLabel?: string;
}

export interface CarRental {
  id: string;
  title: string;
  brand: string;
  category: string;
  providerPricePerDay: number;
  profitMarginPerDay: number;
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
  baseCurrency?: 'ARS' | 'USD' | 'BRL';
  type?: 'car';
}

export interface Excursion {
  id: string;
  title: string;
  location: string;
  providerPrice: number;
  profitMargin: number;
  description: string;
  images: string[];
  isOffer: boolean;
  duration: string;
  availableDates: string[];
  baseCurrency?: 'ARS' | 'USD';
  type?: 'excursion';
  rating?: number;
  reviewsCount?: number;
  discount?: number;
  specialLabel?: string;
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  meetingPoint?: string;
  importantInfo?: string;
  cancellationPolicy?: string;
}

export interface InstallmentTrip {
  id: string;
  title: string;
  location: string;
  providerTotalPrice: number;
  profitMargin: number;
  description: string;
  images: string[];
  departureDate: string;
  isOffer: boolean;
  type?: 'installment';
  baseCurrency?: 'ARS' | 'USD';
  discount?: number;
  specialLabel?: string;
}

export interface WorldCupTrip {
  id: string;
  title: string;
  location: string;
  providerTotalPrice: number;
  profitMargin: number;
  description: string;
  images: string[];
  departureDate: string;
  originCountry: string;
  isOffer: boolean;
  type?: 'worldcup';
  baseCurrency?: 'ARS' | 'USD';
  discount?: number;
  specialLabel?: string;
}

export interface GroupTrip {
  id: string;
  title: string;
  location: string;
  providerPrice: number;
  profitMargin: number;
  description: string;
  images: string[];
  availableDates: string[];
  isOffer: boolean;
  type?: 'group';
  discount?: number;
  baseCurrency?: 'ARS' | 'USD';
  specialLabel?: string;
  durationLabel?: string;
  includesFlight?: boolean;
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

export type ListingItem = Trip | Apartment | Excursion | Hotel | InstallmentTrip | WorldCupTrip | CarRental | GroupTrip;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
