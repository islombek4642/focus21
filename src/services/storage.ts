/**
 * Storage Service
 * Resilient AsyncStorage persistence layer with automatic hydration and memory fallback
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage.ts';
import { useSettingsStore } from '../store/settingsStore.ts';
import { useFocusStore } from '../store/focusStore.ts';
import { usePlannerStore } from '../store/plannerStore.ts';
import { useGoalsStore } from '../store/goalsStore.ts';
import { useAuditStore } from '../store/auditStore.ts';
import { useBalanceStore } from '../store/balanceStore.ts';
import { exportAllData, importAllData } from './backup.ts';
import { setLanguage } from './i18n.ts';

const memoryStore = new Map<string, string>();
let nativeStorageAvailable: boolean | null = null;

function getStorageBackend() {
  const mod = AsyncStorage as unknown as { default?: typeof AsyncStorage };
  return mod.default || AsyncStorage;
}

export async function getStorageItem(key: string): Promise<string | null> {
  if (nativeStorageAvailable !== false) {
    try {
      const backend = getStorageBackend();
      if (backend && typeof backend.getItem === 'function') {
        const val = await backend.getItem(key);
        nativeStorageAvailable = true;
        return val;
      }
    } catch {
      nativeStorageAvailable = false;
    }
  }
  return memoryStore.get(key) ?? null;
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  if (nativeStorageAvailable !== false) {
    try {
      const backend = getStorageBackend();
      if (backend && typeof backend.setItem === 'function') {
        await backend.setItem(key, value);
        nativeStorageAvailable = true;
        return;
      }
    } catch {
      nativeStorageAvailable = false;
    }
  }
  memoryStore.set(key, value);
}

export async function removeStorageItem(key: string): Promise<void> {
  if (nativeStorageAvailable !== false) {
    try {
      const backend = getStorageBackend();
      if (backend && typeof backend.removeItem === 'function') {
        await backend.removeItem(key);
        nativeStorageAvailable = true;
        return;
      }
    } catch {
      nativeStorageAvailable = false;
    }
  }
  memoryStore.delete(key);
}

export interface StoredSettings {
  language: 'uz' | 'ru' | 'en';
  hasSeenOnboarding: boolean;
  hapticsEnabled: boolean;
}

export interface StoredFocusExtra {
  completedChunksCount: number;
  a1Task: { id: string; title: string } | null;
}

export async function persistAppState(): Promise<void> {
  try {
    const backupJson = exportAllData();
    const settingsState = useSettingsStore.getState();
    const focusState = useFocusStore.getState();

    const settingsData: StoredSettings = {
      language: settingsState.language,
      hasSeenOnboarding: settingsState.hasSeenOnboarding,
      hapticsEnabled: settingsState.hapticsEnabled,
    };

    const focusData: StoredFocusExtra = {
      completedChunksCount: focusState.completedChunksCount,
      a1Task: focusState.a1Task,
    };

    const compositePayload = {
      appState: JSON.parse(backupJson),
      settings: settingsData,
      focus: focusData,
    };

    await setStorageItem(STORAGE_KEYS.APP_STATE, JSON.stringify(compositePayload));
  } catch {
    // Fail gracefully in constrained environments
  }
}

export async function hydrateAppState(): Promise<boolean> {
  try {
    const raw = await getStorageItem(STORAGE_KEYS.APP_STATE);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.appState) {
      importAllData(JSON.stringify(parsed.appState));
    }

    if (parsed.settings) {
      const settings = parsed.settings as Partial<StoredSettings>;
      if (settings.language) {
        useSettingsStore.getState().setLanguage(settings.language);
        setLanguage(settings.language);
      }
      if (typeof settings.hasSeenOnboarding === 'boolean') {
        useSettingsStore.getState().setHasSeenOnboarding(settings.hasSeenOnboarding);
      }
      if (typeof settings.hapticsEnabled === 'boolean') {
        useSettingsStore.getState().setHapticsEnabled(settings.hapticsEnabled);
      }
    }

    if (parsed.focus) {
      const focus = parsed.focus as Partial<StoredFocusExtra>;
      if (focus.a1Task) {
        useFocusStore.getState().setA1Task(focus.a1Task);
      }
    }

    return true;
  } catch {
    return false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function triggerDebouncedPersistence(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    persistAppState();
  }, 600);
}

export function initPersistence(): () => void {
  // Hydrate immediately
  hydrateAppState();

  // Subscribe to changes across modules
  const unsubs = [
    usePlannerStore.subscribe(triggerDebouncedPersistence),
    useGoalsStore.subscribe(triggerDebouncedPersistence),
    useAuditStore.subscribe(triggerDebouncedPersistence),
    useBalanceStore.subscribe(triggerDebouncedPersistence),
    useSettingsStore.subscribe(triggerDebouncedPersistence),
    useFocusStore.subscribe(triggerDebouncedPersistence),
  ];

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    unsubs.forEach((u) => u());
  };
}
