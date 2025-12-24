
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
  
  const getDisplayPrice = () => {
    if (item.type === 'car') return item.providerPricePerDay + item.profitMarginPerDay;
    return (item as any).providerPrice + (item as any).profitMargin;
  };

  const price = getDisplayPrice();
  
  let linkUrl = `/trip/${item.id}`;
  if (isExcursion) linkUrl = `/excursions/${item.id}`;
  else if (isCar) linkUrl = `/car/${item.id}`;

  const title = (item as any).brand ? `${(item as any).brand} ${item.title}` : item.title;

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(6,78,59,0.12)] transition-all duration-500 flex flex-col border border-slate-100 hover:-translate-y-2 relative">
      <Link to={linkUrl} className="relative h-56 overflow-hidden block">
        <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {item.isOffer && (
            <span className="absolute top-4 left-4 bg-[#D9F99D] text-[#064E3B] text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest">
                OFERTA ESPECIAL
            </span>
        )}
        
        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-xl border border-white/30 uppercase tracking-widest shadow-sm">
            {(item as any).durationLabel || (item as any).duration || (item as any).category || 'Destacado'}
        </div>
      </Link>
      
      <button 
        onClick={(e) => { e.preventDefault(); !isSelected && addItem(item, 1); }}
        className={`absolute top-4 right-4 p-3 rounded-2xl shadow-xl transition-all z-10 duration-500 ${
            isSelected 
            ? 'bg-[#064E3B] text-[#D9F99D] scale-110' 
            : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-[#064E3B] hover:text-[#D9F99D]'
        }`}
      >
        {isSelected ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
        )}
      </button>

      <div className="p-7 flex-grow flex flex-col">
        <span className="text-[9px] font-black text-[#16A34A] uppercase tracking-[0.25em] mb-2 block">
            {item.type === 'excursion' ? 'Traslado / Excursión' : 
             item.type === 'car' ? 'Rent a Car FF' : 'Turismo Receptivo'}
        </span>
        <Link to={linkUrl} className="text-xl font-bold text-slate-800 leading-tight tracking-tight hover:text-[#064E3B] transition-colors line-clamp-2 min-h-[3rem]">
            {title}
        </Link>
        <div className="flex items-center gap-2 mt-4 text-slate-400">
            <svg className="w-4 h-4 text-[#D9F99D] fill-[#D9F99D]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.location}</span>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-end">
            <div>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Inversión {isCar ? 'x día' : 'desde'}</p>
                <p className="text-2xl font-black text-[#064E3B] tracking-tighter">{formatPrice(price, (item as any).baseCurrency || 'USD')}</p>
            </div>
            <Link to={linkUrl} className="bg-slate-50 p-3.5 rounded-2xl text-slate-400 hover:bg-[#D9F99D] hover:text-[#064E3B] hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
