import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export type Locale = 'sv' | 'en';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const STORAGE_KEY = 'goodasyouare:locale';

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider(props: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('sv');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'sv' || saved === 'en') setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(() => setLocaleState((l) => (l === 'sv' ? 'en' : 'sv')), []);

  const value = useMemo<LocaleContextValue>(() => ({ locale, setLocale, toggleLocale }), [locale, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{props.children}</LocaleContext.Provider>;
}

