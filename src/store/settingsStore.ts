/**
 * Settings Store
 * Manages locale choice and app preferences
 */

import { SupportedLanguage, setLanguage } from '../services/i18n.ts';

export interface SettingsState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
}

type Listener = () => void;

class SettingsStore {
  private state: SettingsState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      language: 'uz',
      setLanguage: (lang) => {
        this.state.language = lang;
        setLanguage(lang);
        this.notify();
      },
      hapticsEnabled: true,
      setHapticsEnabled: (enabled) => {
        this.state.hapticsEnabled = enabled;
        this.notify();
      },
    };
  }

  getState = () => this.state;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify = () => {
    this.listeners.forEach((l) => l());
  };
}

export const useSettingsStore = new SettingsStore();
