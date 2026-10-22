/**
 * Goals Store
 * Manages 3 Spheres (Family, Business, Self) and 3 Golden Questions
 */

export type GoalSphere = 'family' | 'business' | 'self';

export interface Goal {
  id: string;
  sphere: GoalSphere;
  title: string;
  completed?: boolean;
  createdAt: number;
}

export interface GoldenQuestions {
  q1Lottery: string;
  q2SixMonths: string;
  q3DareToDream: string;
  q3NoFailure?: string;
}

export interface KRAItem {
  id: string;
  title: string;
  importanceRank: number;
}

export interface GoalsState {
  goals: Goal[];
  goldenQuestions: GoldenQuestions;
  kraList: KRAItem[];
  addGoal: (sphere: GoalSphere, title: string) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  setGoldenQuestionAnswer: (question: keyof GoldenQuestions, answer: string) => void;
  addKra: (title: string, rank?: number) => void;
  deleteKra: (id: string) => void;
  reset: () => void;
  setGoals: (goals: Goal[]) => void;
}

type Listener = () => void;

class GoalsStore {
  private state: GoalsState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      goals: [],
      goldenQuestions: {
        q1Lottery: '',
        q2SixMonths: '',
        q3DareToDream: '',
        q3NoFailure: '',
      },
      kraList: [],
      addGoal: (sphere, title) => {
        const newGoal: Goal = {
          id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          sphere,
          title,
          completed: false,
          createdAt: Date.now(),
        };
        this.state.goals = [...this.state.goals, newGoal];
        this.notify();
      },
      toggleGoal: (id) => {
        this.state.goals = this.state.goals.map((g) =>
          g.id === id ? { ...g, completed: !g.completed } : g
        );
        this.notify();
      },
      deleteGoal: (id) => {
        this.state.goals = this.state.goals.filter((g) => g.id !== id);
        this.notify();
      },
      setGoldenQuestionAnswer: (question, answer) => {
        this.state.goldenQuestions = {
          ...this.state.goldenQuestions,
          [question]: answer,
        };
        if (question === 'q3DareToDream') {
          this.state.goldenQuestions.q3NoFailure = answer;
        } else if (question === 'q3NoFailure') {
          this.state.goldenQuestions.q3DareToDream = answer;
        }
        this.notify();
      },
      addKra: (title, rank = 1) => {
        const item: KRAItem = {
          id: `kra-${Date.now()}`,
          title,
          importanceRank: rank,
        };
        this.state.kraList = [...this.state.kraList, item];
        this.notify();
      },
      deleteKra: (id) => {
        this.state.kraList = this.state.kraList.filter((k) => k.id !== id);
        this.notify();
      },
      reset: () => {
        this.state.goals = [];
        this.state.goldenQuestions = {
          q1Lottery: '',
          q2SixMonths: '',
          q3DareToDream: '',
          q3NoFailure: '',
        };
        this.state.kraList = [];
        this.notify();
      },
      setGoals: (goals) => {
        this.state.goals = goals;
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

export const useGoalsStore = new GoalsStore();
