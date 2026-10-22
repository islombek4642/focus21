/**
 * Lightweight Type-Safe Localization Engine
 * Supports uz, ru, and en with fallback, defaultValue, and reactive hook
 */

import { useState, useEffect } from 'react';
import uz from '../locales/uz.json' with { type: 'json' };
import ru from '../locales/ru.json' with { type: 'json' };
import en from '../locales/en.json' with { type: 'json' };

export type SupportedLanguage = 'uz' | 'ru' | 'en';

const dictionaries: Record<SupportedLanguage, Record<string, any>> = {
  uz,
  ru,
  en,
};

let currentLanguage: SupportedLanguage = 'uz';
const listeners = new Set<(lang: SupportedLanguage) => void>();

export function getLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function setLanguage(lang: SupportedLanguage): void {
  if (dictionaries[lang]) {
    currentLanguage = lang;
    listeners.forEach((listener) => listener(lang));
  }
}

export function getAvailableLanguages(): SupportedLanguage[] {
  return ['uz', 'ru', 'en'];
}

export function subscribeLanguageChange(callback: (lang: SupportedLanguage) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * React Hook for reactive translations
 * Automatically causes component to re-render when language changes
 */
export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(getLanguage());

  useEffect(() => {
    const unsubscribe = subscribeLanguageChange((newLang) => {
      setLang(newLang);
    });
    return unsubscribe;
  }, []);

  return {
    t: (key: string, params?: Record<string, any>) => t(key, params),
    language: lang,
    setLanguage,
  };
}

/**
 * Translate a dot-delimited key with optional variable interpolation and defaultValue fallback
 * e.g. t('focus.timeRemaining', { time: '01:24:18' })
 * e.g. t('focus.subtitle', { defaultValue: 'Executive OS' })
 */
export function t(key: string, params?: Record<string, any>): string {
  const dict = dictionaries[currentLanguage] || dictionaries.uz;
  const parts = key.split('.');
  let current: any = dict;
  let found = true;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      found = false;
      break;
    }
  }

  // If not found in current language, try English fallback
  if (!found || typeof current !== 'string') {
    let fallback: any = dictionaries.en;
    let fallbackFound = true;
    for (const fPart of parts) {
      if (fallback && typeof fallback === 'object' && fPart in fallback) {
        fallback = fallback[fPart];
      } else {
        fallbackFound = false;
        break;
      }
    }
    if (fallbackFound && typeof fallback === 'string') {
      current = fallback;
    } else if (params && typeof params.defaultValue === 'string') {
      current = params.defaultValue;
    } else {
      return key;
    }
  }

  if (typeof current !== 'string') {
    if (params && typeof params.defaultValue === 'string') {
      current = params.defaultValue;
    } else {
      return key;
    }
  }

  if (params) {
    let result = current;
    for (const [pKey, pVal] of Object.entries(params)) {
      if (pKey === 'defaultValue') continue;
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }
    return result;
  }

  return current;
}
