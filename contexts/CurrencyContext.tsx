
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'ARS' | 'USD' | 'BRL' | 'UYU' | 'CLP' | 'COP' | 'MXN';

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, baseCurrency?: string) => string;
  convertPrice: (amount: number, baseCurrency?: string) => number;
}

// Tasas de cambio actualizadas (Base ARS)
const EXCHANGE_RATES = {
  ARS: 1,
  USD: 1220, 
  BRL: 260,  // Actualizado: 1 BRL = 260 ARS
  UYU: 31,   
  CLP: 1.30, 
  COP: 0.28, 
  MXN: 60    
};

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('ARS');

  useEffect(() => {
    const saved = localStorage.getItem('abras_currency');
    const supportedCurrencies = ['ARS', 'USD', 'BRL', 'UYU', 'CLP', 'COP', 'MXN'];
    if (saved && supportedCurrencies.includes(saved)) {
      setCurrencyState(saved as Currency);
    } else {
        setCurrencyState('ARS');
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('abras_currency', c);
  };

  const convertPrice = (amount: number, baseCurrency: string = 'ARS'): number => {
    if (isNaN(amount) || amount === undefined) return 0;

    let amountInArs = amount;
    
    if (baseCurrency === 'USD') {
        amountInArs = amount * EXCHANGE_RATES.USD;
    } else if (baseCurrency === 'ARS') {
        amountInArs = amount;
    } else if (baseCurrency === 'BRL') {
        amountInArs = amount * EXCHANGE_RATES.BRL;
    }

    return amountInArs / EXCHANGE_RATES[currency];
  };

  const formatPrice = (amount: number, baseCurrency: string = 'ARS'): string => {
    const value = convertPrice(amount, baseCurrency);
    
    let locale = 'es-AR';
    if (currency === 'USD') locale = 'en-US';
    if (currency === 'BRL') locale = 'pt-BR';
    if (currency === 'UYU') locale = 'es-UY';
    if (currency === 'CLP') locale = 'es-CL';
    if (currency === 'COP') locale = 'es-CO';
    if (currency === 'MXN') locale = 'es-MX';

    const noFraction = ['CLP', 'COP', 'ARS']; 
    const maxDigits = noFraction.includes(currency) ? 0 : 2;

    const numberString = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: maxDigits,
      maximumFractionDigits: maxDigits
    }).format(value);

    return `${currency} ${numberString}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
