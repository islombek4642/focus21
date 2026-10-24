/**
 * Balance Store
 * Manages Wheel of Life scores, daily family conversation time, and Saying No boundary journal
 */

export interface PillarScores {
  family: number;
  health: number;
  career: number;
  finance: number;
  growth: number;
  rest: number;
  [key: string]: number;
}

export interface RefusalEntry {
  id: string;
  requestTitle: string;
  request?: string;
  declinedAt: number;
  timestamp?: number;
  reason: string;
}

export interface BalanceState {
  scores: PillarScores;
  wheelScores: Record<string, number>;
  familyMinutesToday: number;
  sayingNoEntries: Array<{ id: string; request: string; reason: string; timestamp: number }>;
  refusals: RefusalEntry[];
  setScore: (pillar: keyof PillarScores | string, score: number) => void;
  setWheelScore: (dimension: string, score: number) => void;
  getAverageScore: () => number;
  addFamilyMinutes: (minutes: number) => void;
  addSayingNoEntry: (request: string, reason?: string) => void;
  addRefusal: (requestTitle: string, reason?: string) => void;
  reset: () => void;
  setWheelScores: (scores: Record<string, number>) => void;
  setFamilyMinutesToday: (minutes: number) => void;
  setRefusals: (refusals: RefusalEntry[]) => void;
}

type Listener = () => void;

class BalanceStore {
  private state: BalanceState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const defaultScores: PillarScores = {
      family: 8,
      health: 8,
      career: 8,
      finance: 7,
      growth: 8,
      rest: 7,
    };

    this.state = {
      scores: { ...defaultScores },
      wheelScores: {
        healthEnergy: 8,
        peaceOfMind: 7,
        relationships: 8,
        careerFinance: 9,
        selfDevelopment: 8,
      },
      familyMinutesToday: 0,
      sayingNoEntries: [],
      refusals: [],
      setScore: (pillar, score) => {
        const val = Math.min(10, Math.max(1, score));
        this.state.scores[pillar] = val;
        this.state.wheelScores[pillar] = val;
        this.notify();
      },
      setWheelScore: (dim, score) => {
        const val = Math.min(10, Math.max(1, score));
        this.state.wheelScores[dim] = val;
        this.state.scores[dim] = val;
        this.notify();
      },
      getAverageScore: () => {
        const vals = Object.values(this.state.scores).filter((v) => typeof v === 'number');
        if (vals.length === 0) return 0;
        const sum = vals.reduce((a, b) => a + b, 0);
        return Math.round((sum / vals.length) * 10) / 10;
      },
      addFamilyMinutes: (minutes) => {
        this.state.familyMinutesToday += minutes;
        this.notify();
      },
      addSayingNoEntry: (request, reason = 'Not aligned with core priorities') => {
        const item = {
          id: `refusal-${Date.now()}`,
          request,
          requestTitle: request,
          declinedAt: Date.now(),
          timestamp: Date.now(),
          reason,
        };
        this.state.sayingNoEntries = [item, ...this.state.sayingNoEntries];
        this.state.refusals = [item, ...this.state.refusals];
        this.notify();
      },
      addRefusal: (requestTitle, reason = 'Not aligned with core goals') => {
        const item = {
          id: `refusal-${Date.now()}`,
          request: requestTitle,
          requestTitle,
          declinedAt: Date.now(),
          timestamp: Date.now(),
          reason,
        };
        this.state.sayingNoEntries = [item, ...this.state.sayingNoEntries];
        this.state.refusals = [item, ...this.state.refusals];
        this.notify();
      },
      reset: () => {
        this.state.scores = { ...defaultScores };
        this.state.wheelScores = {
          healthEnergy: 8,
          peaceOfMind: 7,
          relationships: 8,
          careerFinance: 9,
          selfDevelopment: 8,
        };
        this.state.familyMinutesToday = 0;
        this.state.sayingNoEntries = [];
        this.state.refusals = [];
        this.notify();
      },
      setWheelScores: (scores) => {
        this.state.wheelScores = { ...scores };
        this.state.scores = { ...this.state.scores, ...scores };
        this.notify();
      },
      setFamilyMinutesToday: (minutes) => {
        this.state.familyMinutesToday = minutes;
        this.notify();
      },
      setRefusals: (refusals) => {
        this.state.refusals = [...refusals];
        this.state.sayingNoEntries = refusals.map((r) => ({
          id: r.id,
          request: r.requestTitle || r.request || '',
          reason: r.reason || '',
          timestamp: r.declinedAt || r.timestamp || Date.now(),
        }));
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
