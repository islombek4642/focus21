import { useEffect, useState, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusStore } from '../../store/focusStore.ts';

export function useFocusTimer() {
  const [storeState, setStoreState] = useState(() => useFocusStore.getState());

  useEffect(() => {
    const unsubscribe = useFocusStore.subscribe(() => {
      setStoreState({ ...useFocusStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Interval ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (storeState.isRunning) {
      interval = setInterval(() => {
        useFocusStore.getState().tick(1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [storeState.isRunning]);

  // AppState background/foreground compensation
  useEffect(() => {
    let backgroundTimestamp: number | null = null;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        backgroundTimestamp = Date.now();
      } else if (nextAppState === 'active') {
        const state = useFocusStore.getState();
        if (state.isRunning && backgroundTimestamp) {
          const elapsedSec = Math.floor((Date.now() - backgroundTimestamp) / 1000);
          if (elapsedSec > 0) {
            const expectedRemaining = Math.max(0, state.remainingSeconds - elapsedSec);
            useFocusStore.setState({
              remainingSeconds: expectedRemaining,
              secondsRemaining: expectedRemaining,
            });
            if (expectedRemaining === 0) {
              useFocusStore.getState().tick(0);
            }
          }
        }
        backgroundTimestamp = null;
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleStart = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics not supported in tests or web
    }
    useFocusStore.getState().startTimer();
  };

  const handlePause = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    useFocusStore.getState().pauseTimer();
  };

  const handleReset = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
    useFocusStore.getState().resetTimer();
  };

  const formattedTime = useMemo(() => {
    const total = storeState.remainingSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [storeState.remainingSeconds]);

  const progress = useMemo(() => {
    if (storeState.totalSeconds === 0) return 0;
    return storeState.remainingSeconds / storeState.totalSeconds;
  }, [storeState.remainingSeconds, storeState.totalSeconds]);

  return {
    isRunning: storeState.isRunning,
    remainingSeconds: storeState.remainingSeconds,
    totalSeconds: storeState.totalSeconds,
    completedChunksCount: storeState.completedChunksCount,
    formattedTime,
    progress,
    start: handleStart,
    pause: handlePause,
    reset: handleReset,
  };
}
