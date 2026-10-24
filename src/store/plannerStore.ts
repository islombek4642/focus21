/**
 * Planner Store
 * Manages ABCDE prioritization, Salami Slicing, and Pareto 80/20 calculation
 */

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type PriorityType = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Task {
  id: string;
  title: string;
  priority: PriorityType;
  priorityRank?: number; // e.g. 1 for A1, 2 for A2
  completed?: boolean;
  subtasks?: Subtask[];
  createdAt?: number;
}

export interface PlannerState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getParetoTasks: () => Task[];
  reset: () => void;
  setTasks: (tasks: Task[]) => void;
}

type Listener = () => void;

class PlannerStore {
  private state: PlannerState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = {
      tasks: [],
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          createdAt: Date.now(),
          completed: false,
          subtasks: task.subtasks || [],
        };
        this.state.tasks = [...this.state.tasks, newTask].sort(this.sortTasks);
        this.notify();
      },
      updateTask: (id, updates) => {
        this.state.tasks = this.state.tasks
          .map((t) => (t.id === id ? { ...t, ...updates } : t))
          .sort(this.sortTasks);
        this.notify();
      },
      deleteTask: (id) => {
        this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
        this.notify();
      },
      toggleTask: (id) => {
        this.state.tasks = this.state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        this.notify();
      },
      getParetoTasks: () => {
        // Pareto 80/20: top 20% of tasks, minimum 1 if tasks exist
        const allTasks = [...this.state.tasks].sort(this.sortTasks);
        if (allTasks.length === 0) return [];
        const count = Math.max(1, Math.ceil(allTasks.length * 0.2));
        return allTasks.slice(0, count);
      },
      reset: () => {
        this.state.tasks = [];
        this.notify();
      },
      setTasks: (tasks) => {
        this.state.tasks = [...tasks].sort(this.sortTasks);
        this.notify();
      },
    };
  }

  private sortTasks(a: Task, b: Task): number {
    const priorityWeights: Record<PriorityType, number> = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
    };
    const diff = (priorityWeights[a.priority] || 3) - (priorityWeights[b.priority] || 3);
    if (diff !== 0) return diff;
    const rankA = a.priorityRank || 999;
    const rankB = b.priorityRank || 999;
    return rankA - rankB;
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

export const usePlannerStore = new PlannerStore();

/**
 * Automatically calculates recommended priority for next task (Smart Auto-Cascade)
 * Rules based on Brian Tracy's ABCDE & Pareto principles:
 * - Up to 3 active [A] tasks (the vital 20% / frogs)
 * - Up to 4 active [B] tasks (should do)
 * - Beyond that, default to [C] (nice to do)
 */
export function getRecommendedPriority(tasks: Task[]): PriorityType {
  const activeTasks = tasks.filter((t) => !t.completed);
  const aCount = activeTasks.filter((t) => t.priority === 'A').length;
  if (aCount < 3) {
    return 'A';
  }
  const bCount = activeTasks.filter((t) => t.priority === 'B').length;
  if (bCount < 4) {
    return 'B';
  }
  return 'C';
}
