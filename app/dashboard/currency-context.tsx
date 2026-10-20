"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  rate: number; // exchange rate relative to PKR
};

export const CURRENCIES: Currency[] = [
  { code: "PKR", symbol: "Rs", name: "Pakistani Rupee", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.0036 },
  { code: "EUR", symbol: "\u20AC", name: "Euro", rate: 0.0033 },
  { code: "GBP", symbol: "\u00A3", name: "British Pound", rate: 0.0028 },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", rate: 0.013 },
  { code: "AED", symbol: "AED", name: "UAE Dirham", rate: 0.013 },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountInPKR: number) => string;
  convert: (amountInPKR: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("basecrew_currency");
    const found = CURRENCIES.find((c) => c.code === saved);
    if (found) setCurrencyState(found);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("basecrew_currency", c.code);
  };

  const convert = (amountInPKR: number) => amountInPKR * currency.rate;

  const format = (amountInPKR: number) => {
    const converted = convert(amountInPKR);
    return `${currency.symbol} ${converted.toLocaleString("en-US", {
      minimumFractionDigits: currency.rate < 0.01 ? 2 : 0,
      maximumFractionDigits: currency.rate < 0.01 ? 2 : 0,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
