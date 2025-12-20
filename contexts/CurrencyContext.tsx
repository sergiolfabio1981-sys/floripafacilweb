
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'ARS' | 'USD' | 'BRL' | 'UYU' | 'CLP' | 'COP' | 'MXN';

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, baseCurrency?: string) => string;
  convertPrice: (amount: number, baseCurrency?: string) => number;
}

// Tasas de cambio aproximadas (Base ARS - Pesos Argentinos)
// Se calcula: Cuántos ARS vale 1 unidad de la moneda destino.
const EXCHANGE_RATES = {
  ARS: 1,
  USD: 1220, // 1 USD = 1220 ARS
  BRL: 215,  // 1 BRL = 215 ARS
  UYU: 31,   // 1 UYU = 31 ARS
  CLP: 1.30, // 1 CLP = 1.30 ARS
  COP: 0.28, // 1 COP = 0.28 ARS
  MXN: 60    // 1 MXN = 60 ARS
};

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Configuración por defecto: ARS (Pesos Argentinos)
  const [currency, setCurrencyState] = useState<Currency>('ARS');

  useEffect(() => {
    const saved = localStorage.getItem('abras_currency');
    const supportedCurrencies = ['ARS', 'USD', 'BRL', 'UYU', 'CLP', 'COP', 'MXN'];
    if (saved && supportedCurrencies.includes(saved)) {
      setCurrencyState(saved as Currency);
    } else {
        // Forzar ARS como predeterminado si no hay nada guardado
        setCurrencyState('ARS');
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('abras_currency', c);
  };

  // Convert any base currency amount to the currently selected currency
  const convertPrice = (amount: number, baseCurrency: string = 'ARS'): number => {
    if (isNaN(amount) || amount === undefined) return 0;

    // 1. Convert everything to ARS first (Common Denominator)
    let amountInArs = amount;
    
    if (baseCurrency === 'USD') {
        amountInArs = amount * EXCHANGE_RATES.USD;
    } else if (baseCurrency === 'ARS') {
        amountInArs = amount;
    } else if (baseCurrency === 'BRL') {
        amountInArs = amount * EXCHANGE_RATES.BRL;
    }

    // 2. Convert ARS to Target Currency
    return amountInArs / EXCHANGE_RATES[currency];
  };

  const formatPrice = (amount: number, baseCurrency: string = 'ARS'): string => {
    const value = convertPrice(amount, baseCurrency);
    
    // Configuraciones regionales para formato de números
    let locale = 'es-AR'; // Default para ARS
    if (currency === 'USD') locale = 'en-US';
    if (currency === 'BRL') locale = 'pt-BR';
    if (currency === 'UYU') locale = 'es-UY';
    if (currency === 'CLP') locale = 'es-CL';
    if (currency === 'COP') locale = 'es-CO';
    if (currency === 'MXN') locale = 'es-MX';

    // Monedas que generalmente no usan centavos
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
