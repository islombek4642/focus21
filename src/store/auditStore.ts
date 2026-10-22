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

export type TimeLogCategory =
  | 'focus'
  | 'meeting'
  | 'admin'
  | 'rest'
  | 'high-payoff'
  | 'administrative'
  | 'interruption';

export interface TimeLogEntry {
  id: string;
  activity: string;
  durationMinutes: number;
  category: TimeLogCategory;
  timestamp: number;
}

export interface AuditState {
  trafItems: TRAFItem[];
  timeLogs: TimeLogEntry[];
  annualTargetIncome: number; // in USD
  hourlyRate: number; // calculated as annual / 2000 hours
  addTrafItem: (title: string, category: TRAFCategory) => void;
  deleteTrafItem: (id: string) => void;
  addTimeLog: (
    activityOrEntry: string | TimeLogEntry,
    durationMinutes?: number,
    category?: TimeLogCategory
  ) => void;
  deleteTimeLog: (id: string) => void;
  setAnnualTargetIncome: (amount: number) => void;
  setTargetAnnualIncome: (amount: number) => void;
  getHourlyRate: () => number;
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
      annualTargetIncome: 100000,
      hourlyRate: 50,
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
      addTimeLog: (activityOrEntry, durationMinutes = 30, category = 'focus') => {
        if (typeof activityOrEntry === 'object') {
          this.state.timeLogs = [activityOrEntry, ...this.state.timeLogs];
        } else {
          const log: TimeLogEntry = {
            id: `log-${Date.now()}`,
            activity: activityOrEntry,
            durationMinutes,
            category,
            timestamp: Date.now(),
          };
          this.state.timeLogs = [log, ...this.state.timeLogs];
        }
        this.notify();
      },
      deleteTimeLog: (id) => {
        this.state.timeLogs = this.state.timeLogs.filter((l) => l.id !== id);
        this.notify();
      },
      setAnnualTargetIncome: (amount) => {
        this.state.annualTargetIncome = amount;
        this.state.hourlyRate = Math.round(amount / 2000);
        this.notify();
      },
      setTargetAnnualIncome: (amount) => {
        this.state.annualTargetIncome = amount;
        this.state.hourlyRate = Math.round(amount / 2000);
        this.notify();
      },
      getHourlyRate: () => {
        return this.state.hourlyRate;
      },
      reset: () => {
        this.state.trafItems = [];
        this.state.timeLogs = [];
        this.state.annualTargetIncome = 100000;
        this.state.hourlyRate = 50;
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
