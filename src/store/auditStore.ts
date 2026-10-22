/**
 * Audit Store
 * Manages minute-by-minute Time Log, TRAF Inbox, and Hourly Rate Delegation Calculator
 */

export type TRAFCategory = 'toss' | 'refer' | 'action' | 'file';

export interface TRAFItem {
  id: string;
  title: string;
  category: TRAFCategory;
  createdAt: number;
}

export interface TimeLogEntry {
  id: string;
  activity: string;
  durationMinutes: number;
  category: 'high-payoff' | 'administrative' | 'interruption' | 'meeting';
  timestamp: number;
}

export interface AuditState {
  trafItems: TRAFItem[];
  timeLogs: TimeLogEntry[];
  annualTargetIncome: number; // in USD
  hourlyRate: number; // calculated as annual / 2000 hours
  addTrafItem: (title: string, category: TRAFCategory) => void;
  deleteTrafItem: (id: string) => void;
  addTimeLog: (activity: string, durationMinutes: number, category: TimeLogEntry['category']) => void;
  setAnnualTargetIncome: (amount: number) => void;
  reset: () => void;
  setTrafItems: (items: TRAFItem[]) => void;
}

type Listener = () => void;

class AuditStore {
  private state: AuditState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      trafItems: [],
      timeLogs: [],
      annualTargetIncome: 50000,
      hourlyRate: 25,
      addTrafItem: (title, category) => {
        const item: TRAFItem = {
          id: `traf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title,
          category,
          createdAt: Date.now(),
        };
        this.state.trafItems = [item, ...this.state.trafItems];
        this.notify();
      },
      deleteTrafItem: (id) => {
        this.state.trafItems = this.state.trafItems.filter((i) => i.id !== id);
        this.notify();
      },
      addTimeLog: (activity, durationMinutes, category) => {
        const log: TimeLogEntry = {
          id: `log-${Date.now()}`,
          activity,
          durationMinutes,
          category,
          timestamp: Date.now(),
        };
        this.state.timeLogs = [log, ...this.state.timeLogs];
        this.notify();
      },
      setAnnualTargetIncome: (amount) => {
        this.state.annualTargetIncome = amount;
        this.state.hourlyRate = Math.round(amount / 2000); // 50 weeks * 40 hours = 2000h
        this.notify();
      },
      reset: () => {
        this.state.trafItems = [];
        this.state.timeLogs = [];
        this.state.annualTargetIncome = 50000;
        this.state.hourlyRate = 25;
        this.notify();
      },
      setTrafItems: (items) => {
        this.state.trafItems = items;
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

export const useAuditStore = new AuditStore();
