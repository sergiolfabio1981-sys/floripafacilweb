
import React from 'react';
import { Link } from 'react-router-dom';
import { ListingItem } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePlanner } from '../contexts/PlannerContext';

interface TripCardProps { trip: ListingItem; }

const TripCard: React.FC<TripCardProps> = ({ trip: item }) => {
  const { formatPrice } = useCurrency();
  const { addItem, selectedItems } = usePlanner();
  
  const isExcursion = item.type === 'excursion';
  const isCar = item.type === 'car';
  const isSelected = selectedItems.some(i => i.id === item.id);
  
  // Lógica de suma de precios
  const getDisplayPrice = () => {
    if (item.type === 'car') return item.providerPricePerDay + item.profitMarginPerDay;
    if (item.type === 'rental' || item.type === 'hotel') return (item as any).providerPricePerNight + (item as any).profitMarginPerNight;
    if (item.type === 'installment' || item.type === 'worldcup') return (item as any).providerTotalPrice + (item as any).profitMargin;
    return (item as any).providerPrice + (item as any).profitMargin;
  };

  const price = getDisplayPrice();
  
  let linkUrl = `/trip/${item.id}`;
  if (isExcursion) linkUrl = `/excursions/${item.id}`;
  else if (isCar) linkUrl = `/car/${item.id}`;
  else if (item.type === 'hotel') linkUrl = `/hotels/${item.id}`;
  else if (item.type === 'rental') linkUrl = `/rentals/${item.id}`;

  const title = (item as any).brand ? `${(item as any).brand} ${item.title}` : item.title;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:-translate-y-2 relative">
      <Link to={linkUrl} className="relative h-48 overflow-hidden block">
        <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {item.isOffer && <span className="absolute top-4 left-4 bg-lime-500 text-green-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">OFERTA</span>}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-lg">{(item as any).durationLabel || (item as any).duration || (item as any).category || 'Brasil'}</div>
      </Link>
      
      <button 
        onClick={() => !isSelected && addItem(item)}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all z-10 ${isSelected ? 'bg-green-600 text-white' : 'bg-white text-gray-400 hover:text-green-600'}`}
        title={isSelected ? "Ya seleccionado" : "Agregar a mi plan"}
      >
        {isSelected ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
        )}
      </button>

      <div className="p-6 flex-grow flex flex-col">
        <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest mb-1">
            {item.type === 'excursion' ? 'TRASLADO / EXCURSIÓN' : 
             item.type === 'car' ? 'ALQUILER DE COCHE' : 
             item.type === 'hotel' ? 'HOTEL & RESORT' : 'TURISMO RECEPTIVO'}
        </span>
        <Link to={linkUrl} className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-green-600 transition-colors">{title}</Link>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-4 mt-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{item.location}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Precio {isCar ? 'x día' : 'desde'}</p>
                <p className="text-xl font-black text-green-700">{formatPrice(price, (item as any).baseCurrency || 'USD')}</p>
            </div>
            <Link to={linkUrl} className="bg-gray-100 p-2 rounded-full hover:bg-lime-500 hover:text-green-950 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
