/**
 * Balance Store
 * Manages Wheel of Life scores, daily family conversation time, and Saying No boundary journal
 */

export interface WheelScores {
  healthEnergy: number; // 1-10
  peaceOfMind: number;  // 1-10
  relationships: number; // 1-10
  careerFinance: number; // 1-10
  selfDevelopment: number; // 1-10
}

export interface RefusalEntry {
  id: string;
  requestTitle: string;
  declinedAt: number;
  reason: string;
}

export interface BalanceState {
  wheelScores: WheelScores;
  familyMinutesToday: number;
  refusals: RefusalEntry[];
  setWheelScore: (dimension: keyof WheelScores, score: number) => void;
  addFamilyMinutes: (minutes: number) => void;
  addRefusal: (requestTitle: string, reason?: string) => void;
  reset: () => void;
}

type Listener = () => void;

class BalanceStore {
  private state: BalanceState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      wheelScores: {
        healthEnergy: 8,
        peaceOfMind: 7,
        relationships: 8,
        careerFinance: 9,
        selfDevelopment: 8,
      },
      familyMinutesToday: 0,
      refusals: [],
      setWheelScore: (dim, score) => {
        this.state.wheelScores = {
          ...this.state.wheelScores,
          [dim]: Math.min(10, Math.max(1, score)),
        };
        this.notify();
      },
      addFamilyMinutes: (minutes) => {
        this.state.familyMinutesToday += minutes;
        this.notify();
      },
      addRefusal: (requestTitle, reason = 'Not aligned with core goals') => {
        const item: RefusalEntry = {
          id: `refusal-${Date.now()}`,
          requestTitle,
          declinedAt: Date.now(),
          reason,
        };
        this.state.refusals = [item, ...this.state.refusals];
        this.notify();
      },
      reset: () => {
        this.state.wheelScores = {
          healthEnergy: 8,
          peaceOfMind: 7,
          relationships: 8,
          careerFinance: 9,
          selfDevelopment: 8,
        };
        this.state.familyMinutesToday = 0;
        this.state.refusals = [];
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

export const useBalanceStore = new BalanceStore();
