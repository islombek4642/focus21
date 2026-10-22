/**
 * Focus Store
 * Manages 90-minute Chunks of Time timer and A-1 Hero Task
 */

import { TIMER_CONFIG } from '../constants/timer.ts';

export interface FocusState {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  a1Task: { id: string; title: string } | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: (seconds?: number) => void;
  setA1Task: (task: { id: string; title: string } | null) => void;
  reset: () => void;
}

type Listener = () => void;

class FocusStore {
  private state: FocusState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      remainingSeconds: TIMER_CONFIG.DEFAULT_CHUNK_SECONDS,
      totalSeconds: TIMER_CONFIG.DEFAULT_CHUNK_SECONDS,
      isRunning: false,
      a1Task: null,
      startTimer: () => {
        this.state.isRunning = true;
        this.notify();
      },
      pauseTimer: () => {
        this.state.isRunning = false;
        this.notify();
      },
      resetTimer: () => {
        this.state.isRunning = false;
        this.state.remainingSeconds = this.state.totalSeconds;
        this.notify();
      },
      tick: (seconds = 1) => {
        if (!this.state.isRunning) return;
        this.state.remainingSeconds = Math.max(0, this.state.remainingSeconds - seconds);
        if (this.state.remainingSeconds === 0) {
          this.state.isRunning = false;
        }
        this.notify();
      },
      setA1Task: (task) => {
        this.state.a1Task = task;
        this.notify();
      },
      reset: () => {
        this.state.remainingSeconds = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
        this.state.totalSeconds = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
        this.state.isRunning = false;
        this.state.a1Task = null;
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

export const useFocusStore = new FocusStore();
