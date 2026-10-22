/**
 * Focus Store
 * Manages 90-minute Chunks of Time timer and A-1 Hero Task
 */

import { TIMER_CONFIG } from '../constants/timer.ts';

export interface FocusState {
  remainingSeconds: number;
  secondsRemaining: number;
  totalSeconds: number;
  activeChunkMinutes: number;
  isRunning: boolean;
  startedAtTimestamp: number | null;
  completedChunksCount: number;
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
    const initialSeconds = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
    this.state = {
      remainingSeconds: initialSeconds,
      secondsRemaining: initialSeconds,
      totalSeconds: initialSeconds,
      activeChunkMinutes: TIMER_CONFIG.DEFAULT_CHUNK_MINUTES,
      isRunning: false,
      startedAtTimestamp: null,
      completedChunksCount: 0,
      a1Task: null,
      startTimer: () => {
        this.state.isRunning = true;
        this.state.startedAtTimestamp = Date.now();
        this.notify();
      },
      pauseTimer: () => {
        this.state.isRunning = false;
        this.state.startedAtTimestamp = null;
        this.notify();
      },
      resetTimer: () => {
        this.state.isRunning = false;
        this.state.startedAtTimestamp = null;
        this.state.remainingSeconds = this.state.totalSeconds;
        this.state.secondsRemaining = this.state.totalSeconds;
        this.notify();
      },
      tick: (seconds = 1) => {
        if (!this.state.isRunning) return;
        const nextSeconds = Math.max(0, this.state.remainingSeconds - seconds);
        this.state.remainingSeconds = nextSeconds;
        this.state.secondsRemaining = nextSeconds;
        if (nextSeconds === 0) {
          this.state.isRunning = false;
          this.state.startedAtTimestamp = null;
          this.state.completedChunksCount += 1;
        }
        this.notify();
      },
      setA1Task: (task) => {
        this.state.a1Task = task;
        this.notify();
      },
      reset: () => {
        this.state.remainingSeconds = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
        this.state.secondsRemaining = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
        this.state.totalSeconds = TIMER_CONFIG.DEFAULT_CHUNK_SECONDS;
        this.state.activeChunkMinutes = TIMER_CONFIG.DEFAULT_CHUNK_MINUTES;
        this.state.isRunning = false;
        this.state.startedAtTimestamp = null;
        this.state.completedChunksCount = 0;
        this.state.a1Task = null;
        this.notify();
      },
    };
  }

  getState = () => this.state;

  setState = (partial: Partial<FocusState>) => {
    Object.assign(this.state, partial);
    if (partial.remainingSeconds !== undefined && partial.secondsRemaining === undefined) {
      this.state.secondsRemaining = partial.remainingSeconds;
    } else if (partial.secondsRemaining !== undefined && partial.remainingSeconds === undefined) {
      this.state.remainingSeconds = partial.secondsRemaining;
    }
    this.notify();
  };

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify = () => {
    this.listeners.forEach((l) => l());
  };
}

export const useFocusStore = new FocusStore();
