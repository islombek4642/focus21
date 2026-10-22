/**
 * Lightweight Type-Safe Localization Engine
 * Supports uz, ru, and en with fallback and hot-switching
 */

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
  return () => listeners.delete(callback);
}

/**
 * Translate a dot-delimited key with optional variable interpolation
 * e.g. t('focus.timeRemaining', { time: '01:24:18' })
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[currentLanguage] || dictionaries.uz;
  const parts = key.split('.');
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback: any = dictionaries.en;
      for (const fPart of parts) {
        if (fallback && typeof fallback === 'object' && fPart in fallback) {
          fallback = fallback[fPart];
        } else {
          return key;
        }
      }
      current = fallback;
      break;
    }
  }

  if (typeof current !== 'string') {
    return key;
  }

  if (params) {
    let result = current;
    for (const [pKey, pVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    }
    return result;
  }

  return current;
}
