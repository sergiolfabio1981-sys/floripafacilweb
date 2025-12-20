
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ListingItem } from '../types';

export interface PlannerItem {
  id: string;
  item: ListingItem;
  quantity: number;
  days?: number;
  date?: string;
  details?: string;
  calculatedPrice: number; 
  calculatedProfit: number; 
}

interface PlannerContextProps {
  selectedItems: PlannerItem[];
  addItem: (item: ListingItem, quantity: number, days?: number, date?: string, details?: string) => void;
  removeItem: (id: string) => void;
  clearPlanner: () => void;
  totalValue: number;
  totalProfit: number; 
  reservationValue: number;
}

const PlannerContext = createContext<PlannerContextProps | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<PlannerItem[]>([]);

  const addItem = (item: ListingItem, quantity: number, days: number = 1, date?: string, details?: string) => {
    let baseCost = 0;
    let baseProfit = 0;

    if (item.type === 'car') {
        baseCost = item.providerPricePerDay;
        baseProfit = item.profitMarginPerDay;
    } else {
        baseCost = (item as any).providerPrice;
        baseProfit = (item as any).profitMargin;
    }

    const multiplier = (item.type === 'car') ? (days || 1) : quantity;
    
    const calculatedPrice = (baseCost + baseProfit) * multiplier;
    const calculatedProfit = baseProfit * multiplier;

    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev;
      return [...prev, { 
        id: item.id, 
        item, 
        quantity, 
        days, 
        date, 
        details, 
        calculatedPrice,
        calculatedProfit
      }];
    });
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const clearPlanner = () => setSelectedItems([]);

  const totalValue = selectedItems.reduce((acc, curr) => acc + curr.calculatedPrice, 0);
  const totalProfit = selectedItems.reduce((acc, curr) => acc + curr.calculatedProfit, 0);
  const reservationValue = totalValue * 0.40;

  return (
    <PlannerContext.Provider value={{ selectedItems, addItem, removeItem, clearPlanner, totalValue, totalProfit, reservationValue }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within PlannerProvider');
  return context;
};
