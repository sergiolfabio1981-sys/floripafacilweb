
import React from 'react';
import { Link } from 'react-router-dom';
import { ListingItem } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface TripCardProps { trip: ListingItem; }

const TripCard: React.FC<TripCardProps> = ({ trip: item }) => {
  const { formatPrice } = useCurrency();
  const isExcursion = item.type === 'excursion';
  const price = (item as any).price || (item as any).pricePerNight || (item as any).totalPrice || 0;
  const linkUrl = isExcursion ? `/excursions/${item.id}` : `/trip/${item.id}`;

  return (
    <Link to={linkUrl} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {item.isOffer && <span className="absolute top-4 left-4 bg-lime-500 text-green-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">OFERTA</span>}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-lg">{(item as any).durationLabel || (item as any).duration || 'Brasil'}</div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest mb-1">{item.type === 'excursion' ? 'TRASLADO / EXCURSIÓN' : 'TURISMO RECEPTIVO'}</span>
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors">{item.title}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-4 mt-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{item.location}</p>
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Precio desde</p>
                <p className="text-xl font-black text-green-700">{formatPrice(price, (item as any).baseCurrency || 'USD')}</p>
            </div>
            <span className="bg-gray-100 p-2 rounded-full group-hover:bg-lime-500 group-hover:text-green-950 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
